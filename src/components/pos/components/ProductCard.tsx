import { InventoryResponses } from '@/types/inventoryTypes'
import { Product } from '@/types/product'
import { AlertTriangle, Plus } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { CartItem } from '../Pos'
import { PromotionService } from '@/services/apiPromotions'

export const ProductCard = ({ product, addToCart, cart, productsInv }: { cart: CartItem[], productsInv: Partial<InventoryResponses> | null | undefined, product: Product, addToCart: (data: Product) => void }) => {

    const [isOpen, setIsOpen] = useState(false)
    const [promoInfo, setPromoInfo] = useState<{
        hasPromo: boolean;
        finalPrice: number;
        percentage: number;
        discount: number;
        promoData?: any;
    } | null>(null)

    const promoService = new PromotionService()


    // const HundleOnClick = () => {
    //     let cartProdutCount = cart.filter(item => item.product.id === product.id)[0]
    //     console.log(cartProdutCount)

    //     if (cartProdutCount) {
    //         if (cartProdutCount.quantity >= ((productsInv?.quantity ?? 0) - (productsInv?.sales ?? 0))) {
    //             setIsOpen(true)
    //             return
    //         }
    //     }

    //     addToCart(product)
    // }

    const checkPromo = async () => {
        const promo = await promoService.getActivePromotionForProduct(product.id);

        if (promo) {
            const percentage = promo.discount;
            const discount = (product.price * percentage) / 100;
            const finalPrice = product.price - discount;

            setPromoInfo({
                hasPromo: true,
                finalPrice,
                percentage,
                discount,
                promoData: promo
            });
        } else {
            setPromoInfo({
                hasPromo: false,
                finalPrice: product.price,
                percentage: 0,
                discount: 0
            });
        }

        return promo;
    }

    const HundleOnClick = async () => {
        // 1️⃣ First, lookup promotion for this product
        const promo = await checkPromo();

        let priceToUse = product.price;

        if (promo) {
            const percentage = promo.discount;
            const discount = (priceToUse * percentage) / 100;
            const finalPrice = priceToUse - discount;

            setPromoInfo({
                hasPromo: true,
                finalPrice,
                percentage,
                discount,
                promoData: promo
            });

            priceToUse = finalPrice; // override price
        } else {
            setPromoInfo({
                hasPromo: false,
                finalPrice: priceToUse,
                percentage: 0,
                discount: 0
            });
        }

        // 2️⃣ Now continue with your existing cart logic

        const cartProdutCount = cart.filter(item => item.product.id === product.id)[0]

        if (cartProdutCount) {
            if (cartProdutCount.quantity >= ((productsInv?.quantity ?? 0) - (productsInv?.sales ?? 0))) {
                setIsOpen(true)
                return
            }
        }

        // 3️⃣ Pass updated price into addToCart
        addToCart({
            ...product,
            price: priceToUse
        });
    };


    useEffect(() => {
        checkPromo()
    }, [product.id])

    return (
        <>
            <SimpleOutOfStockAlert
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                productName={product.name}
            />
            <div
                key={product.id}
                className={`
        border flex flex-col items-start rounded-xl p-4 transition-shadow cursor-pointer 
        ${((productsInv?.quantity ?? 0) - (productsInv?.sales ?? 0)) <= 0
                        ? "border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20 opacity-70 cursor-not-allowed"
                        : "border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 hover:shadow-md"
                    }
    `}
                onClick={() => HundleOnClick()}
            >
                <div className="flex w-full justify-between items-start mb-2">
                    <h3 className="font-medium text-gray-900 dark:text-white">{product.name}</h3>

                    {/* PRICE BADGE */}
                    <div className="flex flex-col items-end">

                        {/* IF PROMO */}
                        {promoInfo?.hasPromo ? (
                            <>
                                {/* % OFF BADGE */}
                                <span className="text-xs font-bold text-red-600 bg-red-100 dark:text-red-300 dark:bg-red-900/30 px-2 py-1 rounded-full mb-1">
                                    {promoInfo.percentage}% OFF
                                </span>

                                {/* PRICE */}
                                <div className="flex items-center gap-2">
                                    <span className="line-through text-gray-400 text-sm">
                                        K{product.price.toFixed(2)}
                                    </span>
                                    <span className="text-green-600 font-bold">
                                        K{promoInfo.finalPrice.toFixed(2)}
                                    </span>
                                </div>
                            </>
                        ) : (
                            // NO PROMO
                            <span className={`
            text-sm px-2 py-1 rounded-full 
            ${((productsInv?.quantity ?? 0) - (productsInv?.sales ?? 0)) <= 0
                                    ? "text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-900/30"
                                    : "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20"
                                }
        `}>
                                K{product.price.toFixed(2)}
                            </span>
                        )}
                    </div>
                </div>

                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{product.category}</p>

                <div className="flex w-full justify-between items-center">

                    {/* STOCK LABEL */}
                    <span className={`
            text-xs 
            ${((productsInv?.quantity ?? 0) - (productsInv?.sales ?? 0)) <= 0
                            ? "text-red-600 dark:text-red-400 font-semibold"
                            : "text-gray-400 dark:text-gray-500"
                        }
        `}>
                        Stock: {(productsInv?.quantity ?? 0) - (productsInv?.sales ?? 0)}
                    </span>

                    {/* ADD BUTTON */}
                    <button
                        disabled={((productsInv?.quantity ?? 0) - (productsInv?.sales ?? 0)) <= 0}
                        className={`
                p-2 rounded-lg transition-colors 
                ${((productsInv?.quantity ?? 0) - (productsInv?.sales ?? 0)) <= 0
                                ? "bg-gray-300 dark:bg-gray-600 text-gray-100 cursor-not-allowed"
                                : "bg-blue-500/20 text-white hover:bg-blue-600"
                            }
            `}
                    >
                        <Plus className="w-4 h-4" />
                    </button>
                </div>
            </div>

        </>
    )
}


export const SimpleOutOfStockAlert = ({
    isOpen,
    onClose,
    productName = 'Product'
}: { isOpen: boolean, onClose: () => void, productName?: string }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg max-w-xs w-full p-6 text-center animate-scaleIn">
                <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Out of Stock
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {productName} is currently unavailable.
                </p>
                <button
                    onClick={onClose}
                    className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                    OK
                </button>
            </div>
        </div>
    );
};