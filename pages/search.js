import Base from "@layouts/Baseof";
import Post from "@partials/Post";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { useEffect , useState} from "react";
import { setSearch, searchArticles, setPagination, setSelectedTags } from "../redux/slices/articlesSlice";
import Loader from "@layouts/components/Loader";
import Pagination from "@layouts/components/Pagination";
const SearchPage = () => {
  const router = useRouter();
  const { query } = router;
  const dispatch = useDispatch();

  // Get articles and search-related state from Redux
  const { searchData, articles, searchStatus, pagination,totalPages, search, selectedTags } = useSelector((state) => state.articles);
  // const { articles, totalPages } = useSelector((state) => state.articles);

  const [currentPage, setCurrentPage] = useState(1);
  useEffect(() => {
    // dispatch(searchArticles({ page: currentPage, pageSize: 8 }));
    
    dispatch(searchArticles({ search: search, tags: selectedTags, page: currentPage, pageSize: 8 }));
    <p>{JSON.stringify(articles)}</p>
  }, [currentPage, dispatch]);

  useEffect(() => {
    if (searchStatus === 'idle' && !query.articles) {
      // Dispatch the search keyword to Redux
            dispatch(searchArticles({ search: search, tags: selectedTags, page: currentPage, pageSize: 8 }));
    }
  }, [search, selectedTags, searchStatus, dispatch]);
  


  if(searchStatus === 'loading'){
     return <Base title={`looking for ${search} in ${selectedTags.forEach(element => {
      (<span>{element.replace("-"," ")}</span>);
     })}`}>
        <Loader />
      </Base>;
    }

        // Function to handle page change
        const handlePageChange = (page) => {
          // Dispatch action to update the pagination in the global state
          // dispatch(setPagination({ ...pagination, currentPage: page }));
          setCurrentPage(page); // Update the current page state
      
          // Call your function to fetch data based on the page number
          dispatch(searchArticles({ search: search, tags: selectedTags, page: currentPage, pageSize: 8 }));
        };
  return (
    <Base title={`Search results for ${search}`}>

      <div className="section">
        <div className="container">
          <h1 className="h2 mb-8 text-center">
            Search results for <span className="text-primary">{query.key}</span>
          </h1>
        
          {searchData.articles && searchData.articles.length > 0 ? (
            <div className="row">
              {searchData.articles.map((post, i) => (
                <div key={`key-${i}`} className="col-12 mb-8 md:col-6">
                  <Post post={post} />
                </div>
              ))}

 {searchData?.totalPages > 1 && ( 
  <Pagination
    section={router.query.section || ""}
    totalPages={searchData.totalPages}
    currentPage={currentPage}
    onPageChange={handlePageChange} // Pass the handler to the Pagination component
  />
)} 
</div>
          ) : (
            <div className="py-24 text-center text-h3 shadow">
              No Search Results Found
              {/* {JSON.stringify(searchData)} */}
            </div>
          )}
        </div>
      </div>
    </Base>
  );
};

export default SearchPage;
