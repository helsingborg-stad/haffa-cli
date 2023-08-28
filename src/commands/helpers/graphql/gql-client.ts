import { FluentGql, FluentGqlOptions } from "./types";

async function gqlFetch(options: FluentGqlOptions): Promise<any> {
  const response = await (options.fetch || fetch)(options.url, {
    ...options.init,
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...options.headers,
    },
    body: JSON.stringify({
      query: options.query,
      variables: options.variables,
    }),
  });
  return await response.json();
}

async function gqlFetchMap<T>(
  options: FluentGqlOptions,
  property: string,
): Promise<T> {
  const { data, errors } = await gqlFetch(options);
  const [error] = [...(errors || [])].map((error_1) =>
    Object.assign(new Error(error_1.message), error_1),
  );
  if (error) {
    throw error;
  }
  return data[property] as T;
}

export function gqlClient(
  options: FluentGqlOptions = {
    init: null,
    url: `${process.env.HAFFA_BACKEND}/api/v1/haffa/graphql`,
    headers: {},
    query: "",
    variables: null,
  },
): FluentGql {
  return {
    init: (init) => gqlClient({ ...options, init }),
    fetch: (fetch) => gqlClient({ ...options, fetch }),
    url: (url) => gqlClient({ ...options, url }),
    headers: (headers) => gqlClient({ ...options, headers }),
    query: (query) => gqlClient({ ...options, query }),
    variables: (variables) => gqlClient({ ...options, variables }),
    map: <T>(property: string, fixup?: (value: T) => T) =>
      gqlFetchMap<T>(options, property).then((value) =>
        fixup ? fixup(value) : value,
      ),
  };
}
