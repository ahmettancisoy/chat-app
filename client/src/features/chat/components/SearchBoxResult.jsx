import { useEffect } from "react";

const SearchBoxResult = ({ searchResults, handleResultClick }) => {
  useEffect(() => {
    console.log(searchResults);
  }, []);

  return (
    <div className="absolute w-full max-h-full mt-2 bg-slate-100 shadow-xl overflow-hidden rounded-lg px-5 py-3 overflow-y-auto scrollbar">
      {searchResults?.length > 0 &&
        searchResults.map((r) => (
          <a key={r._id} href="#" onClick={() => handleResultClick(r)}>
            <div className="text-sm text-gray-700 py-2 px-4 bg-gradient-to-r hover:from-blue-900 hover:to-blue-700 hover:text-white rounded-md">
              {r.email}
            </div>
          </a>
        ))}
    </div>
  );
};

export default SearchBoxResult;
