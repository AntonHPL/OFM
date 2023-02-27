import { useState, useEffect, useContext, FC } from 'react';
import axios from 'axios';
import { Pagination, Skeleton } from "@mui/material";
import { UserContext } from './UserContext';
import { AdInterface } from "../types";
import AdCard from './AdCard';

const MyAds: FC = () => {
  const { user } = useContext(UserContext);
  const [myAds, setMyAds] = useState<Array<AdInterface> | null>(null);
  const [adsLoading, setAdsLoading] = useState(false);
  const [pageCount, setPageCount] = useState(0);

  const [page, setPage] = useState(1);
  const PER_PAGE = 3;

  const changePage = (page: number): void => {
    setPage(page);
  };

  useEffect(() => {
    if (user) {
      setAdsLoading(true);
      axios
        .get(`/api/items/${user._id}`, {
          params: {
            page,
            perPage: PER_PAGE,
          }
        })
        .then(({ data }) => {
          setMyAds(data);
          return axios.get("/api/count_items", {
            params: {
              userId: user._id || undefined,
            }
          })
        })
        .then(({ data }) => {
          setPageCount(Math.ceil(data / PER_PAGE));
          setAdsLoading(false);
        })
        .catch(error => {
          console.error("The error occured: ", error.message);
          setAdsLoading(false);
        })
    }

  }, [user, page]);

  return (
    <>
      <div className="my-ads-container">
        {adsLoading ?
          function () {
            let content = [];
            for (let i = 0; i < 3; i++) {
              content.push(
                <Skeleton
                  variant="rectangular"
                  className="skeleton"
                />
              );
            };
            return content;
          }() :
          myAds?.map(ad => (
            <AdCard ad={ad} />
          ))
        }
        {pageCount > 1 &&
          <Pagination
            count={pageCount}
            defaultPage={1}
            variant="outlined"
            color="primary"
            size="large"
            onChange={(_, page) => changePage(page)}
            page={page}
            disabled={adsLoading}
          />
        }
      </div>
    </>
  );
};

export default MyAds;