document.addEventListener('DOMContentLoaded', function() {
    // Shopping cart functionality
    let cart = JSON.parse(localStorage.getItem('atelierCart')) || [];
    updateCartCount();
    
    // Product category filtering
    const categoryLinks = document.querySelectorAll('[data-category]');
    categoryLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Remove active class from all links
        categoryLinks.forEach(l => l.classList.remove('active'));
        // Add active class to clicked link
        this.classList.add('active');
        
        const category = this.getAttribute('data-category');
        filterProducts(category);
      });
    });
    
    // Add to cart buttons
    const buyButtons = document.querySelectorAll('.buy-btn');
    buyButtons.forEach(button => {
      button.addEventListener('click', function() {
        const productId = this.getAttribute('data-id');
        const productName = this.getAttribute('data-name');
        const productPrice = parseFloat(this.getAttribute('data-price'));
        
        // Check if product is already in cart
        const existingProduct = cart.find(item => item.id === productId);
        
        if (existingProduct) {
          existingProduct.quantity += 1;
        } else {
          cart.push({
            id: productId,
            name: productName,
            price: productPrice,
            quantity: 1
          });
        }
        
        // Save to localStorage
        localStorage.setItem('atelierCart', JSON.stringify(cart));
        
        // Update cart count
        updateCartCount();
        
        // Show confirmation
        alert(`${productName} added to your cart!`);
      });
    });
    
    // Cart button opens modal
    const cartBtn = document.getElementById('cart-btn');
    if (cartBtn) {
      cartBtn.addEventListener('click', function() {
        populateCartModal();
        const cartModal = new bootstrap.Modal(document.getElementById('cartModal'));
        cartModal.show();
      });
    }
    
    // Checkout button
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', function() {
        if (cart.length > 0) {
          alert('Thank you for your order! In a real application, you would be redirected to a payment gateway.');
          // Clear cart
          cart = [];
          localStorage.setItem('atelierCart', JSON.stringify(cart));
          updateCartCount();
          // Hide modal
          const cartModal = bootstrap.Modal.getInstance(document.getElementById('cartModal'));
          cartModal.hide();
        } else {
          alert('Your cart is empty!');
        }
      });
    }
    
    // Helper Functions
    function updateCartCount() {
      const cartCountElements = document.querySelectorAll('.cart-count');
      const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
      
      cartCountElements.forEach(element => {
        element.textContent = itemCount;
      });
    }
    
    function filterProducts(category) {
      const products = document.querySelectorAll('.product-item');
      
      products.forEach(product => {
        if (category === 'all' || product.getAttribute('data-category') === category) {
          product.style.display = 'block';
        } else {
          product.style.display = 'none';
        }
      });
    }
    
    function populateCartModal() {
      const cartItemsElement = document.getElementById('cart-items');
      const cartTotalElement = document.getElementById('cart-total');
      
      // Clear existing items
      cartItemsElement.innerHTML = '';
      
      if (cart.length === 0) {
        cartItemsElement.innerHTML = '<tr><td colspan="5" class="text-center">Your cart is empty</td></tr>';
        cartTotalElement.textContent = '$0.00';
        return;
      }
      
      // Add each item to the cart
      let total = 0;
      
      cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${item.name}</td>
          <td>$${item.price.toFixed(2)}</td>
          <td>
            <div class="input-group input-group-sm">
              <button class="btn btn-outline-secondary decrease-qty" data-id="${item.id}">-</button>
              <span class="form-control text-center">${item.quantity}</span>
              <button class="btn btn-outline-secondary increase-qty" data-id="${item.id}">+</button>
            </div>
          </td>
          <td>$${itemTotal.toFixed(2)}</td>
          <td>
            <button class="btn btn-sm btn-danger remove-item" data-id="${item.id}">
              <i class="bi bi-trash"></i>
            </button>
          </td>
        `;
        
        cartItemsElement.appendChild(row);
      });
      
      // Update total
      cartTotalElement.textContent = `$${total.toFixed(2)}`;
      
      // Add event listeners for quantity buttons and remove buttons
      document.querySelectorAll('.increase-qty').forEach(button => {
        button.addEventListener('click', function() {
          const productId = this.getAttribute('data-id');
          const item = cart.find(item => item.id === productId);
          item.quantity += 1;
          localStorage.setItem('atelierCart', JSON.stringify(cart));
          populateCartModal();
          updateCartCount();
        });
      });
      
      document.querySelectorAll('.decrease-qty').forEach(button => {
        button.addEventListener('click', function() {
          const productId = this.getAttribute('data-id');
          const item = cart.find(item => item.id === productId);
          if (item.quantity > 1) {
            item.quantity -= 1;
          } else {
            cart = cart.filter(i => i.id !== productId);
          }
          localStorage.setItem('atelierCart', JSON.stringify(cart));
          populateCartModal();
          updateCartCount();
        });
      });
      
      document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', function() {
          const productId = this.getAttribute('data-id');
          cart = cart.filter(item => item.id !== productId);
          localStorage.setItem('atelierCart', JSON.stringify(cart));
          populateCartModal();
          updateCartCount();
        });
      });
    }
  });
  