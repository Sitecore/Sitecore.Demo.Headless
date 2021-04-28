import { BuyerProduct } from "ordercloud-javascript-sdk";
import { useEffect } from "react";
import { isEqual } from "lodash";
import { useOcDispatch, useOcSelector } from "../redux/ocStore";
import { OcProductListOptions, setListOptions } from "../redux/ocProductList";

const useOcProductList = (
  listOptions: OcProductListOptions
): BuyerProduct[] => {
  const dispatch = useOcDispatch();

  const { products, options, isAuthenticated, loading } = useOcSelector(
    (s) => ({
      isAuthenticated: s.ocAuth.isAuthenticated,
      loading: s.ocProductList.loading,
      products: s.ocProductList.items,
      options: s.ocProductList.options,
    })
  );

  useEffect(() => {
    if (
      isAuthenticated &&
      (!options || (options && !isEqual(listOptions, options)))
    ) {
      dispatch(setListOptions(listOptions));
    }

    /**
     * I believe this line (which is supposed to clean up promises when the component is unmounted)
     * is getting hit when running in decoupled mode because the google maps integration is failing.
     */
    // return () => promise && promise.abort();
  }, [dispatch, options, loading, listOptions, isAuthenticated]);

  return products;
};

export default useOcProductList;
