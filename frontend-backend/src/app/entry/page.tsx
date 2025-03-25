import SearchResults from "@/components/SearchResults";

const EntryPage = () => {
    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">Entries</h1>
            <SearchResults />
        </div>
    );
};


export default EntryPage