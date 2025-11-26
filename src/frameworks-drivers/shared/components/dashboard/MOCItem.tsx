/**
 * MOCItem component — a thin wrapper around shadcn Item.
 *
 * Purpose:
 * Display a single MOC (Map of Content) entry with name, path, and last access.
 *
 * Features:
 * - Click to open
 * - Default shadcn Item styling
 */

import React from 'react';
import { FileText } from 'lucide-react';
import { Item, ItemMedia, ItemTitle, ItemDescription } from '@/frameworks-drivers/shared/ui/item';

// Type for MOC item
type MOCItemType = {
  id: string;
  name: string;
  path: string;
  lastAccessed?: Date;
};

interface MOCItemProps {
  item: MOCItemType;
  onOpenMocFile: (moc: MOCItemType) => void;
}

export const MOCItem: React.FC<MOCItemProps> = ({
  item,
  onOpenMocFile,
}) => {
  return (
    <Item
      onClick={() => onOpenMocFile(item)}
		variant="muted"
		size="sm"
		className="group ui-item"
    >
      <div className="flex items-center mb-2">
        <ItemMedia>
          <FileText className="h-5 w-5 mr-2" />
        </ItemMedia>
        <ItemTitle className="text-sm font-medium truncate">
          {item.name}
        </ItemTitle>
      </div>
      <ItemDescription className="text-xs text-muted-foreground truncate leading-tight mt-1">
        路径: {item.path}
      </ItemDescription>
      {item.lastAccessed && (
        <ItemDescription className="text-xs text-muted-foreground mt-1">
          最后访问: {item.lastAccessed.toLocaleDateString()}
        </ItemDescription>
      )}
    </Item>
  );
};

export default MOCItem;
