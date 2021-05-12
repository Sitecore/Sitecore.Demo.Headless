import { Category } from "ordercloud-javascript-sdk";
import { useEffect } from "react";
import { isEqual } from "lodash";
import { OcCategoryListOptions, setListOptions } from "../redux/ocCategoryList";

import { useOcDispatch, useOcSelector } from "../redux/ocStore";

const useOcCategoryList = (listOptions: OcCategoryListOptions): Category[] => {
  const dispatch = useOcDispatch();

  const { categories, options, isAuthenticated } = useOcSelector((s) => ({
    isAuthenticated: s.ocAuth.isAuthenticated,
    categories: s.ocCategoryList.items,
    options: s.ocCategoryList.options,
  }));

  useEffect(() => {
    let promise;
    if (
      isAuthenticated &&
      (!options || (options && !isEqual(listOptions, options)))
    ) {
      promise = dispatch(setListOptions(listOptions));
    }
    return () => promise && promise.abort();
  }, [dispatch, options, listOptions, isAuthenticated]);

  return categories;
};

export default useOcCategoryList;
