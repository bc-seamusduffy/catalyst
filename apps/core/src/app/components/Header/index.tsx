import { cs } from '@bigcommerce/reactant/cs';
import {
  NavigationMenu,
  NavigationMenuCollapsed,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuToggle,
} from '@bigcommerce/reactant/NavigationMenu';
import { Menu, Search, ShoppingCart } from 'lucide-react';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { Suspense } from 'react';

import client from '~/client';

import { StoreLogo } from '../StoreLogo';

import { LinkNoCache } from './LinkNoCache';

const Cart = async () => {
  const cartId = cookies().get('cartId')?.value;

  if (!cartId) {
    return <ShoppingCart aria-hidden="true" />;
  }

  const cart = await client.getCart(cartId);

  if (!cart) {
    return <ShoppingCart aria-hidden="true" />;
  }

  const count = cart.lineItems.totalQuantity;

  return (
    <LinkNoCache href="/cart">
      <span className="sr-only">Cart Items</span>

      <div className="relative">
        <ShoppingCart aria-hidden="true" />
        <div className="dark:border-gray-900 absolute -right-4 -top-4 inline-flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-blue-primary text-sm font-bold text-white">
          {count}
        </div>
      </div>
    </LinkNoCache>
  );
};

const HeaderNav = async ({
  className,
  isMenuMobile = false,
}: {
  className?: string;
  isMenuMobile?: boolean;
}) => {
  const categoryTree = await client.getCategoryTree();

  return (
    <NavigationMenuList className={className}>
      {isMenuMobile && (
        <NavigationMenuItem className="md:hidden">
          <NavigationMenuLink asChild>
            <Link aria-label="Search" href="/search">
              Search <Search aria-hidden="true" className="sm:hidden" />
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      )}
      {categoryTree.map((category, index) => (
        <NavigationMenuItem
          className={cs(
            !isMenuMobile && index > 2 && 'sm:hidden lg:block',
            isMenuMobile && index < 3 && 'sm:hidden',
          )}
          key={category.path}
        >
          <NavigationMenuLink asChild>
            <Link href={`/category/${category.entityId}`}>{category.name}</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      ))}
    </NavigationMenuList>
  );
};

export const Header = () => {
  return (
    <header>
      <NavigationMenu>
        <Link href="/">
          <StoreLogo />
        </Link>
        <HeaderNav />
        <div className="flex gap-5">
          <NavigationMenuList className="flex">
            <NavigationMenuItem className="hidden md:block">
              <Link aria-label="Search" href="/search">
                <Search />
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Suspense fallback={<ShoppingCart aria-hidden="true" />}>
                <Cart />
              </Suspense>
            </NavigationMenuItem>
          </NavigationMenuList>
          <NavigationMenuToggle className="sm:block lg:hidden">
            <Menu />
          </NavigationMenuToggle>
        </div>
        <NavigationMenuCollapsed>
          <HeaderNav isMenuMobile={true} />
        </NavigationMenuCollapsed>
      </NavigationMenu>
    </header>
  );
};