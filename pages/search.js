import Base from "@layouts/Baseof";
import Post from "@partials/Post";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { setSearch, searchArticles, setPagination, setSelectedTags } from "../redux/slices/articlesSlice";
import Loader from "@layouts/components/Loader";

const SearchPage = () => {
  const router = useRouter();
  const { query } = router;
  const dispatch = useDispatch();

  // Get articles and search-related state from Redux
  const { searchData: searchResults, searchStatus, pagination, search, setSelectedTags } = useSelector((state) => state.articles);

  useEffect(() => {
    if (searchStatus === 'idle' || query.key || query?.tags?.length>0) {
      // Dispatch the search keyword to Redux
      dispatch(setSearch(query.key));
      // dispatch(set)
      // Fetch articles based on the current search term
      dispatch(searchArticles({ search: query.key, tags: query.tags, page: pagination.currentPage, pageSize: pagination.pageSize }));
    }
  }, [query.key, query?.tags?.length, searchStatus, pagination.currentPage, pagination.pageSize, dispatch]);

  return (
    <Base title={`Search results for ${query.key}`}>
      <div className="section">
        <div className="container">
          <h1 className="h2 mb-8 text-center">
            Search results for <span className="text-primary">{query.key}</span>
          </h1>
          {searchStatus === 'loading' ? (
            // <div className="py-24 text-center text-h3 shadow">Loading...</div>
             <Loader/>
          ) : searchResults?.data?.length > 0 ? (
            <div className="row">
              {searchResults?.data?.map((post, i) => (
                <div key={`key-${i}`} className="col-12 mb-8 sm:col-6">
                  <Post post={post} />
                </div>
              ))}
            </div>
          ) : (
            <div className="py-24 text-center text-h3 shadow">
              No Search Results Found
              {/* {JSON.stringify(searchResults)} */}
            </div>
          )}
        </div>
      </div>
    </Base>
  );
};

export default SearchPage;
