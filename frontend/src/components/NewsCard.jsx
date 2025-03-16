const NewsCard = ({ article }) => {
    
    const imageUrl = article.urlToImage || null;
    
    // Format publish date nicely
    const formatDate = (dateString) => {
      if (!dateString) return "";
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", { 
        month: "short", 
        day: "numeric", 
        year: "numeric" 
      });
    };
  
    // Truncate content to prevent overflow
    const truncateContent = (content, maxLength = 120) => {
      if (!content) return "";
      if (content.length <= maxLength) return content;
      return content.substring(0, maxLength).trim() + "...";
    };
  
    return (
      <div className="flex flex-col h-full bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 transition-all duration-300 hover:shadow-xl">
        <div className="relative h-48 overflow-hidden">
          <img
            src={imageUrl}
            className="w-full h-full object-cover"
            alt={"News image"}
          />
          {article.source?.name && (
            <span className="absolute top-3 left-3 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
              {article.source.name}
            </span>
          )}
        </div>
        
        <div className="flex flex-col flex-grow p-4">
          <h2 className="font-bold text-xl mb-2 line-clamp-2">{article.title}</h2>
          
          <p className="text-gray-600 mb-3 flex-grow">
            {truncateContent(article.content)}
          </p>
          
          <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
            <span className="text-xs text-gray-500">
              {formatDate(article.publishedAt)}
            </span>
            
            <a 
              href={article.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-blue-600 font-medium text-sm hover:text-blue-800 flex items-center"
            >
              Read More
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    );
  };
  
  export default NewsCard;