import { Category } from "ordercloud-javascript-sdk";
import { useEffect, useMemo } from "react";
import { setCategoryId } from "../redux/ocCategoryDetail";
import { useOcDispatch, useOcSelector } from "../redux/ocStore";

const useOcCategoryDetail = (
  categoryId: string
): {
  category?: Category;
} => {
  const dispatch = useOcDispatch();

  const { category, isAuthenticated } = useOcSelector((s) => ({
    category: s.ocCategoryDetail.category,
    isAuthenticated: s.ocAuth.isAuthenticated,
  }));

  useEffect(() => {
    let promise;
    console.log(categoryId);
    if (categoryId && isAuthenticated) {
      promise = dispatch(setCategoryId(categoryId));
    }
    return () => promise && promise.abort();
  }, [dispatch, categoryId, isAuthenticated]);

  const result = useMemo(
    () => ({
      category,
    }),
    [category]
  );

  return result;
};

export default useOcCategoryDetail;
