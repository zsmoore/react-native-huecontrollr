import { formatForPost, generate, TypeHint } from './generate';
import type { ControllrRequest } from './request';

// hacky hack to dynamically remove undefines set from blindly constructing objects
function removeNulls<T extends object>(t: T): object {
  interface anyObj {
    [key: string]: any;
  }
  let newObj: anyObj = {};
  Object.keys(t).forEach((key) => {
    if (t[key as keyof T] === Object(t[key as keyof T])) {
      newObj[key] = removeNulls(t[key as keyof T] as unknown as object);
    } else if (t[key as keyof T] !== undefined) {
      newObj[key] = t[key as keyof T];
    }
    return newObj;
  });
  return t;
}

export function get<T>(
  request: ControllrRequest,
  typeHint: TypeHint,
  onResponse: (t: T) => void
) {
  console.log('getting');
  fetch(request.url)
    .then((response) => response.json())
    .then((json) => {
      console.log('get received');
      console.log(json);
      const t: T | null = generate(json, typeHint);
      if (t !== null) {
        console.log(t);
        onResponse(t);
      } else {
        console.log('Could not parse');
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

export function batchGet<T>(
  request: ControllrRequest,
  typeHint: TypeHint,
  onResponse: (batchResponse: Map<Number, T>) => void
) {
  console.log('batch getting');
  fetch(request.url)
    .then((response) => response.json())
    .then((json) => {
      console.log('batch get received');
      console.log(json);
      const responseMap = new Map<Number, T>();
      for (const key in json) {
        const t: T | null = generate(json[key], typeHint);
        if (t !== null) {
          responseMap.set(parseInt(key, 10), t);
        } else {
          console.log('Failed to parse batch get object');
        }
      }
      onResponse(responseMap);
    })
    .catch((error) => {
      console.log(error);
    });
}

export function put<T, R>(
  request: ControllrRequest,
  data: T,
  inputTypeHint: TypeHint,
  outputTypeHint?: TypeHint,
  onResponse?: (resp: R) => void
) {
  const t: any = removeNulls(formatForPost(data, inputTypeHint));
  console.log('putting');
  console.log(t);
  fetch(request.url, {
    method: 'PUT',
    body: t,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((responseJson) => {
      console.log('put received');
      console.log(responseJson);
      if (onResponse && outputTypeHint) {
        const r: R | null = generate(responseJson, outputTypeHint);
        if (r !== null) {
          console.log(r);
          onResponse(r);
        } else {
          console.log('Could not parse response');
        }
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

export function post<T, R>(
  request: ControllrRequest,
  data: T,
  inputTypeHint: TypeHint,
  outputTypeHint: TypeHint,
  onResponse: (resp: R) => void
) {
  const t: any = removeNulls(formatForPost(data, inputTypeHint));
  console.log('posting');
  console.log(t);
  fetch(request.url, {
    method: 'POST',
    body: t,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((responseJson) => {
      console.log('post received');
      console.log(responseJson);
      const r: R | null = generate(responseJson, outputTypeHint);
      console.log(r);
      if (r !== null) {
        console.log(r);
        onResponse(r);
      } else {
        console.log('Could not parse response');
      }
    })
    .catch((error) => {
      console.log(error);
    });
}
