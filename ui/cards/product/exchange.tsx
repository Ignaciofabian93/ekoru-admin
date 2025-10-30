import { Product } from "@/types/product";
import Image from "next/image";

type Props = {
  product: Product;
};
export default function ExchangeCard({ product }: Props) {
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
          {/* <span
            className={`${getBadgeColor(
              product.badge
            )} text-xs font-medium px-2 py-1 rounded`}
          >
            {product.badge}
          </span> */}
        </span>
        <span className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm text-text-primary text-xs font-medium px-2 py-1 rounded">
          {product.condition}
        </span>
      </figure>
      <div className="p-3">
        <header className="flex items-center justify-between mb-2">
          <span className="text-text-muted text-xs truncate">{/* {product.category} */}</span>
          <span className="text-text-secondary text-xs flex-shrink-0 ml-2">
            {/* {product.interested} interesados */}
          </span>
        </header>
        <h3 className="font-medium text-text-primary text-sm mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        {/* <p className="text-text-muted text-xs mb-2">Por {product.owner}</p> */}
        <div className="bg-primary/5 rounded-lg p-2 mb-3">
          <p className="text-primary text-xs font-medium">{/* Busca: {product.exchangeFor} */}</p>
        </div>
        <footer>
          <button
            className="w-full bg-secondary hover:bg-secondary/80 text-white py-2 rounded-lg transition-colors duration-200 text-sm font-medium"
            aria-label="Proponer intercambio"
          >
            Proponer Intercambio
          </button>
        </footer>
      </div>
    </article>
  );
}
