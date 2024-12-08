import { SortOption } from '@/types/types';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@components/ui/select';
import { SelectIcon } from '@radix-ui/react-select';
import { FilterIcon } from 'lucide-react';

interface SortSelectProps {
  sortOption: SortOption;
  onSortChange: (value: SortOption) => void;
}

const SortSelect = ({ sortOption, onSortChange }: SortSelectProps) => {
  return (
    <Select value={sortOption} onValueChange={onSortChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Sort by" />
        <SelectIcon asChild>
          <FilterIcon className='w-4 h-4 opacity-50' />
        </SelectIcon>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Sort Options</SelectLabel>
          <SelectItem value="dateAsc">Date (Ascending)</SelectItem>
          <SelectItem value="dateDesc">Date (Descending)</SelectItem>
          <SelectItem value="clicksAsc">Clicks (Ascending)</SelectItem>
          <SelectItem value="clicksDesc">Clicks (Descending)</SelectItem>
          <SelectItem value="duplicateAsc">Duplicates Only</SelectItem>
          <SelectItem value="toBeDeleted">To Be Deleted</SelectItem>
          <SelectItem value="everything">Everything</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default SortSelect;
