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
  const { searchData, searchStatus, pagination, search, selectedTags } = useSelector((state) => state.articles);

  useEffect(() => {
    if (searchStatus === 'idle' && !query.searchData) {
      // Dispatch the search keyword to Redux
            dispatch(searchArticles({ search: search, tags: selectedTags, page: pagination.currentPage, pageSize: pagination.pageSize }));
    }
  }, [search, selectedTags, searchStatus, dispatch]);
  


  if(searchStatus === 'loading'){
     return <Base title={`looking for ${search} in ${selectedTags.forEach(element => {
      (<span>{element.replace("-"," ")}</span>);
     })}`}>
        <Loader />
      </Base>;
    }
  return (
    <Base title={`Search results for ${search}`}>

      <div className="section">
        <div className="container">
          <h1 className="h2 mb-8 text-center">
            Search results for <span className="text-primary">{query.key}</span>
          </h1>
          {searchData && searchData.length > 0 ? (
            <div className="row">
              {searchData.map((post, i) => (
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
