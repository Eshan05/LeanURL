import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@components/ui/select';

const SortSelect = ({ sortOption, onSortChange }) => {
  return (
    <Select value={sortOption} onValueChange={onSortChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Sort Options</SelectLabel>
          <SelectItem value="dateAsc">Date (Ascending)</SelectItem>
          <SelectItem value="dateDesc">Date (Descending)</SelectItem>
          <SelectItem value="clicksAsc">Clicks (Ascending)</SelectItem>
          <SelectItem value="clicksDesc">Clicks (Descending)</SelectItem>
          <SelectItem value="duplicateAsc">Duplicates Only</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default SortSelect;
