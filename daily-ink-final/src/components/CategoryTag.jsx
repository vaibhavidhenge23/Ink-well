import { categoryColorMap } from '@/data/types';
import { jsx as _jsx } from "react/jsx-runtime";
const CategoryTag = ({
  category,
  size = 'sm'
}) => {
  const bgClass = categoryColorMap[category] || 'bg-primary';
  return /*#__PURE__*/_jsx("span", {
    className: `inline-block rounded-full font-sans font-medium ${bgClass} text-foreground ${size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-3 py-1 text-xs'}`,
    children: category
  });
};
export default CategoryTag;