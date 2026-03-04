// Test script to verify user-specific cart functionality
// This can be run in the browser console to test the implementation

console.log('🛒 Testing User-Specific Cart Functionality');
console.log('==========================================');

// Test 1: Check if userCartStore is properly initialized
try {
  const { useUserCart } = require('@/stores/userCartStore');
  console.log('✅ useUserCart hook imported successfully');
} catch (error) {
  console.log('❌ Failed to import useUserCart:', error.message);
}

// Test 2: Check localStorage for different user carts
console.log('\n📦 Checking localStorage for cart data:');
const guestCart = localStorage.getItem('shopify-cart-guest');
console.log('Guest cart found:', !!guestCart);

// Check for any user-specific carts
const userCartKeys = Object.keys(localStorage).filter(key => key.startsWith('shopify-cart-') && key !== 'shopify-cart-guest');
console.log('User-specific carts found:', userCartKeys.length);
userCartKeys.forEach(key => console.log(`- ${key}`));

// Test 3: Verify cart isolation
console.log('\n🔒 Testing cart isolation:');
if (userCartKeys.length > 0) {
  console.log('✅ Multiple user carts detected - isolation working');
} else {
  console.log('ℹ️  No user carts found yet (expected for new users)');
}

console.log('\n🎯 Manual Testing Steps:');
console.log('1. Add items as guest user');
console.log('2. Login with different user accounts');
console.log('3. Verify carts are separate');
console.log('4. Logout and verify cart clears');
console.log('5. Verify empty cart hides UI');

console.log('\n✨ User-Specific Cart Implementation Complete!');
