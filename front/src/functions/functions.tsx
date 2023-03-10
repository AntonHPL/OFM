import axios from "axios";
import { AdInterface, ErrorInterface, GetAdsPropsInterface, ProfileContextInterface } from "../types";
import { useOutletContext } from "react-router-dom";

export const getAds = ({
  functionProps: {
    page,
    PER_PAGE,
    sortingParams,
    subString,
    categoryId = "",
    subCategoryId = "",
  },
  setAds,
  setPageCount,
  setAdsAmount,
  setAdsLoading
}: GetAdsPropsInterface) => {
  setAdsLoading(true);
  axios
    .get("/api/items", {
      params: {
        page,
        perPage: PER_PAGE,
        field: sortingParams && sortingParams[0] || undefined,
        order: sortingParams && sortingParams[1] || undefined,
        subString: subString || undefined,
        categoryId: categoryId || undefined,
        subCategoryId: subCategoryId || undefined,
      }
    })
    .then(({ data }) => {
      const entries = (obj: object) => Object.entries(obj);

      setAds(
        data.length ? data.filter((el: AdInterface) =>
          entries(el.textInfo).length > 0 &&
          entries(el.textInfo).filter(([key, value]) => key !== "price").findIndex(([key, value]) => value === "") < 0) : null
      );
      axios.get("/api/count_items", {
        params: {
          subString: subString || undefined,
          categoryId: categoryId || undefined,
          subCategoryId: subCategoryId || undefined,
        }
      })
        .then(({ data }) => {
          setPageCount(Math.ceil(data / PER_PAGE));
          setAdsAmount(data);
          setAdsLoading(false);
        });
    })
    .catch(error => console.error("The error occured: ", error.message));
};

export const errorFound = (errors: Array<ErrorInterface>, field: string): ErrorInterface | undefined => errors.find(el => el.field === field);
export const resetErrors = (errors: Array<ErrorInterface>, field: string, setErrors: (cb: (prev: Array<ErrorInterface>) => Array<ErrorInterface>) => void): void => {
  errorFound(errors, field) && setErrors(prev => prev.filter((el => el.field !== field)));
};

export const useProfileContext = (): ProfileContextInterface => useOutletContext<ProfileContextInterface>();