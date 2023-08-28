import { gqlClient } from "../graphql";
import type {
  AdvertInput,
  AdvertMutationResult,
  AdvertsRepository,
} from "./types";
import type { FluentGql } from "../graphql/types";

const ERROR_NOT_FOUND = "NOT FOUND";

function notProvided(method: string): () => never {
  return (): never => {
    throw new Error(`Advert::${method} is not provided`);
  };
}

function gql(
  token: string,
  callback?: typeof fetch,
  init?: RequestInit,
): FluentGql {
  return gqlClient()
    .init(init)
    .fetch(callback)
    .headers({
      Authorization: `Bearer ${token}`,
    });
}

function valueAndValidOrThrowNotFound<T>(value: T, isValid: any) {
  if (!isValid) {
    throw Object.assign(new Error(ERROR_NOT_FOUND), { code: 404 });
  }
  return value;
}

function expectAdvert(result: AdvertMutationResult): AdvertMutationResult {
  return valueAndValidOrThrowNotFound(result, result && result.advert);
}

const advertProps = `
	id
	createdAt
	title
	description
	quantity
	meta {
		reservableQuantity
		collectableQuantity
		canEdit
		canRemove
		canBook
		canReserve
		canCancelReservation
		canCollect
		claims {
			by
			at
			quantity
			type
		}
	}
	images {
		url
	}
	unit
	material
	condition
	usage

	location {
		adress
		zipCode
		city
		country
	}
	contact {
		email
		phone
	}
`;

const mutationProps = `
	advert {
		${advertProps}
	}
	status {
		code
		message
		field
	}
`;

const createAdvertMutation = /* GraphQL */ `
mutation Mutation(
	$input: AdvertInput!
) {
	createAdvert(input: $input) {
		${mutationProps}
	}
}
`;

export function createAdvertsRepository(
  token: string,
  callback?: typeof fetch,
): AdvertsRepository {
  return {
    getTerms: notProvided("getTerms"),
    getAdvert: notProvided("getAdverts"),
    listAdverts: notProvided("listAdverts"),
    async createAdvert(input: AdvertInput): Promise<AdvertMutationResult> {
      const result = await gql(token, callback)
        .query(createAdvertMutation)
        .variables({ input })
        .map<AdvertMutationResult>("createAdvert");
      return expectAdvert(result);
    },
    updateAdvert: notProvided("updateAdvert"),
    removeAdvert: notProvided("removeAdvert"),
    reserveAdvert: notProvided("reserveAdvert"),
    cancelAdvertReservation: notProvided("cancelAdvertReservation"),
    collectAdvert: notProvided("collectAdvert"),
  };
}
