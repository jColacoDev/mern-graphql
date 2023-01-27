import React from 'react'

export default function PostPagination({page, setPage, totalPages}) {

    const pagination = () =>{
        let pages = [];
        for(let i = 1; i <= totalPages; i++){
          pages.push(
            <li key={i}>
              <a onClick={()=>setPage(i)} 
                className={`page-link ${page === i && 'activePagination'}`}
              >{i}</a>
            </li>
          )
        }
        return pages;
      }

  return (
    <nav>
        <ul className="pagination justify-content-center">
        <li>
          <a onClick={()=>page > 1 && setPage(page - 1)} 
            className={`page-link ${page === 1 && 'disabled'}`}
            disabled = {page <= 1}
          >Previous</a>
        </li>
          {pagination()}
        <li>
          <a onClick={()=>page < totalPages && setPage(page + 1)} 
            className={`page-link`}
            disabled = {page >= totalPages}
          >Next</a>
        </li>
        </ul>
      </nav>
    )
}
