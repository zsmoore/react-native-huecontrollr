import { formatForPost, generate, TypeHint } from './generate';
import type { ControllrRequest } from './request';

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
  const t: any = formatForPost(data, inputTypeHint);
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
  const t: any = formatForPost(data, inputTypeHint);
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
