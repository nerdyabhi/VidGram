import {  SearchIcon } from "lucide-react"

export const SearchInput = () => {
    return (
        <form className="flex w-full max-w-[600px]">
            <div className="relative w-full">
                <input type="text" placeholder="search"
                 className=" pl-4 py-2 pr-12 rounded-l-full border focus:outline-none focus:border-blue-500 " />
            </div>

            <button type="submit"
            className="w-full bg-gray-100 hover:bg-gray-200 pl-4 pr-12 rounded-r-full border foucs:outline-none focus:border-blue-500"
            >
                <SearchIcon className="size-5"/>
            </button>

            
        </form>
    )
}