import { Order } from "@/types/entrepreneur";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash } from "lucide-react";
import { formatCurrency, formatDate } from "@/utils/formatUtils";

export function OrderCard({ 
  order,
  onEdit,
  onDelete 
}: { 
  order: Order;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="border rounded-lg p-4 space-y-3 bg-white shadow-sm">
      <div className="flex justify-between">
        <span className="font-medium">#{order.id.substring(0,6)}</span>
        <Badge variant={order.status === 'Paid' ? 'success' : 'destructive'}>
          {order.status}
        </Badge>
      </div>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <p className="text-muted-foreground">Pelanggan</p>
          <p>{order.customer?.name || '-'}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Tanggal</p>
          <p>{formatDate(new Date(order.order_date))}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Metode</p>
          <p>{order.payment_method}</p>
        </div>
        <div className="text-right">
          <p className="text-muted-foreground">Total</p>
          <p className="font-medium">{formatCurrency(order.total)}</p>
        </div>
      </div>
      <div className="flex space-x-2 pt-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1"
          onClick={onEdit}
        >
          <Edit className="h-4 w-4 mr-1.5" />
          Edit
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1 text-destructive"
          onClick={onDelete}
        >
          <Trash className="h-4 w-4 mr-1.5" />
          Hapus
        </Button>
      </div>
    </div>
  );
}
