import { Product } from "@/types/product";
import { ShoppingCart, Star } from "lucide-react";
import Image from "next/image";

type Props = {
  product: Product;
};

export default function SecondHandCard({ product }: Props) {
  return (
    <article className="flex-shrink-0 w-48 sm:w-56 bg-white rounded-xl shadow-sm border border-neutral/20 overflow-hidden hover:shadow-lg transition-all duration-200 group">
      <figure className="relative aspect-square">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-200"
        />
        <span className="absolute top-2 left-2">
          <span
          // className={`${getBadgeColor(
          //   product.badges[0]
          // )} text-xs font-medium px-2 py-1 rounded`}
          >
            {/* {product.badges[0]} */}
          </span>
        </span>
        <span className="absolute top-2 right-2 bg-success text-white text-xs font-medium px-2 py-1 rounded">
          -{product.price}%
        </span>
        <span className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm text-text-primary text-xs font-medium px-2 py-1 rounded">
          {product.condition}
        </span>
      </figure>
      <div className="p-3">
        <header className="flex items-center justify-between mb-2">
          <span className="text-text-muted text-xs truncate">{product.brand}</span>
          <div className="flex items-center flex-shrink-0 ml-2">
            <Star className="w-3 h-3 text-warning fill-warning" />
            <span className="text-text-secondary text-xs ml-1">{/* {product.rating} ({product.reviews}) */}</span>
          </div>
        </header>
        <h3 className="font-medium text-text-primary text-sm mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        <p className="text-text-muted text-xs mb-2">Por {product.sellerId}</p>
        <footer className="flex items-center justify-between">
          <div className="min-w-0">
            <span className="text-lg font-bold text-text-primary">€{product.price}</span>
            <span className="text-text-muted text-xs line-through ml-1">€{product.offerPrice}</span>
          </div>
          <button
            className="bg-primary hover:bg-primary-dark text-white p-2 rounded-lg transition-colors duration-200 flex-shrink-0"
            aria-label="Añadir al carrito"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </footer>
      </div>
    </article>
  );
}
