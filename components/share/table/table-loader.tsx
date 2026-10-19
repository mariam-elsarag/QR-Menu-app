import { Skeleton } from "@/components/ui/skeleton";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";

type TableLoaderProps = {
  columns: number;
  rows?: number;
};

const TableLoader = ({ columns, rows = 5 }: TableLoaderProps) => {
  return (
    <TableBody>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <TableRow key={rowIndex}>
          {Array.from({ length: columns }).map((_, colIndex) => (
            <TableCell key={colIndex}>
              <Skeleton
                className={`h-5 ${colIndex === 0 ? "w-3/4" : "w-full"}`}
              />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  );
};

export default TableLoader;
