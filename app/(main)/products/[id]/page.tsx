"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import { formatPrice, slugify } from "@/lib/utils";
import { toast } from "sonner";
import { FaHeart } from "react-icons/fa";
import { SignInButton } from "@clerk/nextjs";

// --- Modern, Compact Message Form ---
interface MessageFormProps {
  product: any;
  grower: any;
  onClose: () => void;
  onMessageSuccess: () => void;
}

function MessageForm({ product, grower, onClose, onMessageSuccess }: MessageFormProps) {
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const user = useQuery(api.users.getUserByUserId);
  const sendMessage = useMutation(api.messages.sendMessage);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !grower?.userId) return;

    setIsSubmitting(true);
    try {
      await sendMessage({
        senderId: user._id,
        recipientId: grower.userId,
        content: `Regarding product "${product.name}": ${message}`,
        sentAt: Date.now()
      });

      onMessageSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to send message:", error);
      alert("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-2">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm">
        <div className="p-5">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold text-[var(--primary)] tracking-tight">Message Grower</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-[var(--primary)] text-xl transition"
              aria-label="Close"
            >
              ×
            </button>
          </div>
          <div className="mb-3 flex items-center gap-3 bg-[var(--accent)]/40 rounded-xl px-3 py-2">
            <div>
              <div className="font-bold text-[var(--primary)] text-base">{product.name}</div>
              <div className="text-xs text-[var(--secondary)]">To: {grower?.name || 'Grower'}</div>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-2">
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Ask about this coffee or farming practices..."
              rows={3}
              className="w-full bg-[var(--light-bg)] border-none rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--primary)] resize-none"
              required
            />
            <div className="flex gap-2 mt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2 rounded-lg bg-gray-100 text-[var(--secondary)] font-medium hover:bg-gray-200 transition text-sm"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition text-sm"
                disabled={isSubmitting || !message.trim()}
              >
                {isSubmitting ? 'Sending...' : 'Send'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// --- Modern, Compact Product Detail Page ---
export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user: clerkUser, isLoaded } = useUser();
  const productParam = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [showMessageForm, setShowMessageForm] = useState(false);
  const [selectedImageIdx, setSelectedImageIdx] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const [wished, setWished] = useState<boolean>(false);

  const user = useQuery(api.users.getUserByUserId);
  const allProducts = useQuery(api.products.listProducts) || [];
  const product = allProducts.find((p: any) => {
    try {
      return slugify(p.name) === productParam || (p._id as unknown as string) === productParam;
    } catch {
      return false;
    }
  });

  // Wishlist state from server
  const wishlist = useQuery(api.wishlist.getWishlist) || [];
  useEffect(() => {
    if (product && wishlist) {
      const isWished = wishlist.some((w: any) => w.productId === product._id);
      setWished(isWished);
    }
  }, [product, wishlist]);

  const addToCart = useMutation(api.cart.addToCart);
  const toggleWishlist = useMutation(api.wishlist.toggleWishlist);

  // Since products no longer have growerId, we'll skip grower queries for now
  // In a real application, you might want to implement a different way to associate products with growers
  const grower = null;

  // Consistent horizontal padding for all sections
  const sectionPadding = "clamp(1rem, 5vw, 2.5rem)";

  useEffect(() => {
    if (product !== undefined) {
      setIsLoading(false);
      // Debug: Log product data to see what we're getting
      console.log('Product data loaded:', product);
      console.log('Product imageUrl:', product?.imageUrl);
      console.log('Product imageUrl type:', Array.isArray(product?.imageUrl) ? 'array' : typeof product?.imageUrl);
      console.log('Product primary image:', Array.isArray(product?.imageUrl) ? product?.imageUrl?.[0] : product?.imageUrl);
    }
  }, [product]);

  const handleMessageSuccess = () => {
    alert("Message sent successfully! The grower will respond soon.");
  };

  const canMessage = clerkUser && user && grower?.userId;

  if (!isLoading && !product) {
    return (
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: `0 ${sectionPadding}` }}>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-[var(--primary)] mb-4">Product Not Found</h2>
          <p className="text-[var(--secondary)] mb-6">The product you are looking for doesn't exist or has been removed.</p>
          <Link href="/products" className="inline-block px-6 py-3 bg-[var(--primary)] text-white rounded-xl font-semibold hover:bg-[var(--primary)]/90 hover:shadow-lg transition-all duration-200">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading || !product) {
    return (
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: `0 ${sectionPadding}` }}>
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)]"></div>
          <span className="ml-3 text-[var(--secondary)]">Loading product...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20 md:pt-72" style={{ maxWidth: "1100px", margin: "0 auto", padding: `0 ${sectionPadding}` }}>
      <div className="py-8 md:py-12">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 pb-3 mt-12 text-sm text-[var(--secondary)] mb-6">
          <Link href="/products" className="hover:underline font-medium transition-colors">Shop</Link>
          <span>/</span>
          <span className="text-[var(--primary)] font-semibold">{product.name}</span>
        </div>
        
        {/* Product Detail Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          {/* Left: Gallery */}
          <div className=" md:top-44">
            <div className="bg-[#f3f3f3] rounded-xl overflow-hidden">
              <div className="relative aspect-[4/3]">
                <Image
                  src={Array.isArray(product.imageUrl)
                    ? (product.imageUrl[selectedImageIdx] && product.imageUrl[selectedImageIdx] !== 'undefined' && product.imageUrl[selectedImageIdx] !== 'null' ? product.imageUrl[selectedImageIdx] : '/coffee1.jpg')
                    : ((product.imageUrl && product.imageUrl !== 'undefined' && product.imageUrl !== 'null') ? product.imageUrl : '/coffee1.jpg')}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-contain p-6"
                />
              </div>
            </div>
            
            {/* Image Thumbnails */}
            {Array.isArray(product.imageUrl) && product.imageUrl.length > 1 && (
              <div className="mt-4 flex gap-2 overflow-x-auto">
                {product.imageUrl.slice(0, 5).map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIdx(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImageIdx === index 
                        ? 'border-[var(--primary)] ring-2 ring-[var(--primary)]/20' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Image
                      src={image && image !== 'undefined' && image !== 'null' ? image : '/coffee1.jpg'}
                      alt={`${product.name} - Image ${index + 1}`}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Info */}
          <div className="space-y-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-2xl md:text-3xl font-bold text-[var(--primary)] mb-3">{product.name}</h1>
                <p className="text-[var(--secondary)] text-base leading-relaxed mb-4">{product.description}</p>
              </div>
              <div className="flex items-center gap-2">
                {!clerkUser || !isLoaded ? (
                  <SignInButton mode="modal">
                    <button
                      className="w-9 h-9 rounded-full border flex items-center justify-center transition-colors text-gray-600 border-gray-300 hover:text-[var(--primary)] hover:border-[var(--primary)]"
                      aria-label="Sign in to add to wishlist"
                    >
                      <FaHeart />
                    </button>
                  </SignInButton>
                ) : (
                  <button
                    onClick={async () => {
                      try {
                        const res = await toggleWishlist({ productId: product._id });
                        setWished((prev) => !prev);
                        toast.success(res?.wished ? "Added to wishlist" : "Removed from wishlist");
                      } catch (e) {
                        toast.error("Failed to update wishlist");
                      }
                    }}
                    className={`w-9 h-9 rounded-full border flex items-center justify-center transition-colors ${
                      wished 
                        ? 'bg-[var(--primary)] text-white border-[var(--primary)]' 
                        : 'text-gray-600 border-gray-300 hover:text-[var(--primary)] hover:border-[var(--primary)]'
                    }`}
                    aria-label="Toggle wishlist"
                  >
                    <FaHeart />
                  </button>
                )}
              </div>
            </div>

            <div className="text-2xl font-semibold text-[var(--primary)]">
              {formatPrice(product.price)}
            </div>

            {/* Selects */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <select className="h-11 rounded-md border px-3 text-sm">
                <option>Weight: {product.weight}</option>
              </select>
              <select className="h-11 rounded-md border px-3 text-sm">
                <option>Origin: {product.origin}</option>
              </select>
            </div>

            {/* Quantity and CTA */}
            <div className="flex items-center gap-3">
              <div className="flex items-center border rounded-full">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-10 h-10 text-lg"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <div className="w-10 text-center select-none">{quantity}</div>
                <button
                  onClick={() => setQuantity(q => Math.min(99, q + 1))}
                  className="w-10 h-10 text-lg"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
              
              {!clerkUser || !isLoaded ? (
                <SignInButton mode="modal">
                  <button
                    disabled={product.stock <= 0}
                    className="flex-1 h-11 rounded-full bg-[var(--primary)] text-white font-semibold hover:bg-[var(--primary)]/90 transition disabled:opacity-60 min-w-[200px]"
                  >
                    Sign in to add to cart
                  </button>
                </SignInButton>
              ) : (
                <button
                  onClick={async () => {
                    try {
                      await addToCart({ productId: product._id, quantity });
                      toast.success("Added to cart");
                    } catch (e) {
                      toast.error("Failed to add to cart");
                    }
                  }}
                  disabled={product.stock <= 0}
                  className="flex-1 h-11 rounded-full bg-[var(--primary)] text-white font-semibold hover:bg-[var(--primary)]/90 transition disabled:opacity-60 min-w-[200px]"
                >
                  Add to cart
                </button>
              )}
            </div>

            {/* Meta */}
            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
              {grower && <span className="rounded-full px-2.5 py-1 bg-[var(--accent)] text-[var(--primary)]">By {grower.name}</span>}
            </div>
          </div>
        </div>
        
      </div>
      
      {/* Modals */}
      {showMessageForm && grower && (
        <MessageForm product={product} grower={grower} onClose={() => setShowMessageForm(false)} onMessageSuccess={handleMessageSuccess} />
      )}
    </div>
  );
}