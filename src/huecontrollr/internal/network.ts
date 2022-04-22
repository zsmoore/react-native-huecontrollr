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
  fetch(request.url)
    .then((response) => response.json())
    .then((json) => {
      const t: T | null = generate(json, typeHint);
      if (t !== null) {
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
  fetch(request.url)
    .then((response) => response.json())
    .then((json) => {
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
  fetch(request.url, {
    method: 'PUT',
    body: JSON.stringify(t),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((responseJson) => {
      if (onResponse && outputTypeHint) {
        const r: R | null = generate(responseJson, outputTypeHint);
        if (r !== null) {
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
  fetch(request.url, {
    method: 'POST',
    body: JSON.stringify(t),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((responseJson) => {
      const r: R | null = generate(responseJson, outputTypeHint);
      if (r !== null) {
        onResponse(r);
      } else {
        console.log('Could not parse response');
      }
    })
    .catch((error) => {
      console.log(error);
    });
}
