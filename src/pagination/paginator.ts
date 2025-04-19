import { PaginateOptions } from "src/types";

export const paginator = ({ limit,page,total}:PaginateOptions) =>{

    const lastPage= Math.ceil(total/limit);

    return {
        limit,
        lastPage,
        currentPage: page,
        perpage:limit,
        prev: page > 0 ? page -1: null,
        next: page < lastPage ? page +1: null  
    }
}