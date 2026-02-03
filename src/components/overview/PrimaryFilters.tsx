import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronDown, Check, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { FilterOptionItem } from "@/lib/api";

interface SelectFilterProps {
  label: string;
  placeholder: string;
  options: FilterOptionItem[];
  selectedValue: string | null;
  onChange: (value: string | null) => void;
  loading?: boolean;
}

const SelectFilter = ({
  label,
  placeholder,
  options,
  selectedValue,
  onChange,
  loading,
}: SelectFilterProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredOptions = useMemo(() => {
    const sorted = [...options].sort((a, b) => b.count - a.count);
    if (!search) return sorted;
    return sorted.filter((opt) =>
      opt.value.toLowerCase().includes(search.toLowerCase())
    );
  }, [options, search]);

  const selectedOption = options.find((o) => o.value === selectedValue);

  const handleSelect = (value: string) => {
    onChange(value === selectedValue ? null : value);
    setOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
  };

  return (
    <Popover open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen);
      if (!isOpen) setSearch("");
    }}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "h-9 gap-2 font-normal min-w-[140px] justify-between",
            selectedValue && "border-primary/50 bg-primary/5"
          )}
          disabled={loading || options.length === 0}
        >
          <span className="text-muted-foreground text-xs mr-1">{label}:</span>
          <span className="truncate max-w-[100px]">
            {selectedOption?.value || placeholder}
          </span>
          {selectedValue ? (
            <X 
              className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground shrink-0" 
              onClick={handleClear}
            />
          ) : (
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0" align="start" sideOffset={4}>
        {/* Search */}
        <div className="p-2 border-b border-border">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={`Search...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 h-8 text-sm"
              autoFocus
            />
          </div>
        </div>

        {/* Options */}
        <ScrollArea className="max-h-64">
          <div className="p-1">
            {filteredOptions.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                {search ? "No matches found" : "No options"}
              </p>
            ) : (
              filteredOptions.map((option) => {
                const isSelected = option.value === selectedValue;
                return (
                  <button
                    key={option.value}
                    onClick={() => handleSelect(option.value)}
                    className={cn(
                      "w-full flex items-center gap-2 px-2 py-1.5 rounded text-sm transition-colors text-left",
                      isSelected ? "bg-primary/10 text-primary" : "hover:bg-muted/50"
                    )}
                  >
                    <span className="flex-1 truncate">{option.value}</span>
                    <span className="text-xs text-muted-foreground tabular-nums shrink-0">
                      {option.count.toLocaleString()}
                    </span>
                    {isSelected && <Check className="h-4 w-4 shrink-0" />}
                  </button>
                );
              })
            )}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

interface PrimaryFiltersProps {
  conversionEvents: FilterOptionItem[];
  walletActions: FilterOptionItem[];
  selectedConversionEvent: string | null;
  selectedWalletAction: string | null;
  onConversionEventChange: (value: string | null) => void;
  onWalletActionChange: (value: string | null) => void;
  loading?: boolean;
}

export const PrimaryFilters = ({
  conversionEvents,
  walletActions,
  selectedConversionEvent,
  selectedWalletAction,
  onConversionEventChange,
  onWalletActionChange,
  loading,
}: PrimaryFiltersProps) => {
  const hasConversions = conversionEvents.length > 0;
  const hasWalletActions = walletActions.length > 0;

  if (!hasConversions && !hasWalletActions) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      {hasConversions && (
        <SelectFilter
          label="Conversion"
          placeholder="All"
          options={conversionEvents}
          selectedValue={selectedConversionEvent}
          onChange={onConversionEventChange}
          loading={loading}
        />
      )}
      {hasWalletActions && (
        <SelectFilter
          label="Wallet Action"
          placeholder="All"
          options={walletActions}
          selectedValue={selectedWalletAction}
          onChange={onWalletActionChange}
          loading={loading}
        />
      )}
    </div>
  );
};
