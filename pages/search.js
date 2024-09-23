import Base from "@layouts/Baseof";
import Post from "@partials/Post";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { setSearch, fetchArticles, setPagination } from "../redux/slices/articlesSlice";
import Loader from "@layouts/components/Loader";

const SearchPage = () => {
  const router = useRouter();
  const { query } = router;
  const dispatch = useDispatch();

  // Get articles and search-related state from Redux
  const { items: searchResults, status, pagination, search } = useSelector((state) => state.articles);

  useEffect(() => {
    if (query.key) {
      // Dispatch the search keyword to Redux
      dispatch(setSearch(query.key));

      // Fetch articles based on the current search term
      dispatch(fetchArticles({ search: query.key, page: pagination.currentPage, pageSize: pagination.pageSize }));
    }
  }, [query.key, pagination.currentPage, pagination.pageSize, dispatch]);

  return (
    <Base title={`Search results for ${query.key}`}>
      <div className="section">
        <div className="container">
          <h1 className="h2 mb-8 text-center">
            Search results for <span className="text-primary">{query.key}</span>
          </h1>
          {status === 'loading' ? (
            // <div className="py-24 text-center text-h3 shadow">Loading...</div>
             <Loader/>
          ) : searchResults.length > 0 ? (
            <div className="row">
              {searchResults.map((post, i) => (
                <div key={`key-${i}`} className="col-12 mb-8 sm:col-6">
                  <Post post={post} />
                </div>
              ))}
            </div>
          ) : (
            <div className="py-24 text-center text-h3 shadow">
              No Search Results Found
            </div>
          )}
        </div>
      </div>
    </Base>
  );
};

export default SearchPage;
