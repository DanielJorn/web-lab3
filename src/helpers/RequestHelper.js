import { counter, errors } from "../store";

class RequestHelper {
  constructor() {
    this.API_URL = HTTP_LINK;
  }
  async fetchGraphQL(operationsDoc, operationName, variables) {
    try {
      const result = await fetch(this.API_URL, {
        method: "POST",
        body: JSON.stringify({
          query: operationsDoc,
          variables: variables,
          operationName: operationName,
        }),
      });
      return result.json();
    } catch (e) {
      console.error(e);
      $errors = [e.message];
    }
  }

  fetchMyQuery(operationsDoc) {
    return this.fetchGraphQL(operationsDoc, "MyQuery", {});
  }

  async startFetchMyQuery(operationsDoc) {
    counter.update((n) => n + 1);
    const { errors: errs, data } = await this.fetchMyQuery(operationsDoc);
    counter.update((n) => n - 1);

    if (errs) {
      // handle those errors like a pro
      console.error(errs);
      throw errs[0].message;
    }

    // do something great with this precious data
    return data;
  }

  executeMyMutation(operationsDoc) {
    return this.fetchGraphQL(operationsDoc, "MyMutation", {});
  }

  async startExecuteMyMutation(operationsDoc) {
    counter.update((n) => n + 1);
    const { errors: errs, data } = await this.executeMyMutation(operationsDoc);
    counter.update((n) => n - 1);

    if (errs) {
      // handle those errors like a pro
      console.error(errs);
      throw errs[0].message;
    }

    // do something great with this precious data
    console.log(data);
    return data;
  }
}

export default new RequestHelper();
