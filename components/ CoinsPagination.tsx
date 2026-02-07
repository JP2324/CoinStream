'use client'
import React from 'react'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { useRouter } from "next/navigation";
import { buildPageNumbers, ELLIPSIS } from '@/lib/utils';
import { Span } from 'next/dist/trace';
import { cn } from '@/lib/utils';

const CoinsPagination = ({ currentPage, hasMorePages, totalPages }:
    Pagination) => {

    const router = useRouter();
    const handlePageChange = (page:number) =>{
        router.push(`/coins?page=${page}`);
    }
    const pageNumbers = buildPageNumbers(currentPage,totalPages)
    const isLastPage = !hasMorePages || currentPage === totalPages;

    return (
        <Pagination id = 'coins-pagination'>
            <PaginationContent className='pagination-content'>

                <PaginationItem>
                    <PaginationPrevious onClick={
                        ()=> currentPage >1 && handlePageChange(currentPage -1)

                    } />
                </PaginationItem>

                <div className='pagination-pages'>
                    {pageNumbers.map((page,index)=>(
                        <PaginationItem key={index}>
                            {page === ELLIPSIS ? (<span className='ellipsis'>...</span>) : (
                                <PaginationLink onClick={
                                    ()=> handlePageChange(page)
                                }className={cn('page-link',{'page-link-active' :currentPage===page})} isActive>{page}</PaginationLink>
                            )}
                        </PaginationItem>
                    ))}
                </div>

                <PaginationItem>
                    <PaginationNext onClick={
                        ()=> !isLastPage && handlePageChange(currentPage +1)
                    }/>
                </PaginationItem>

            </PaginationContent>
        </Pagination>
    )
}

export default  CoinsPagination