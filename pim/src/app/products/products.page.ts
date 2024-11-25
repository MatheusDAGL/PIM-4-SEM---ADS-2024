import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController, NavController } from '@ionic/angular';
import { Product } from '../interfaces/product.interface';
import { BaseService } from '../services/base.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
})
export class ProductsPage implements OnInit {
  products: Product[] = [
    { id: 1, name: 'Brócolis', price: 6.00, quantity: 0, imageurl: 'assets/images/brocolis.png' },
    { id: 2, name: 'Alface', price: 2.50, quantity: 0, imageurl: 'assets/images/alface.png' },
    { id: 3, name: 'Tomate', price: 6.00, quantity: 0, imageurl: 'assets/images/tomate.png' },
    { id: 4, name: 'Pimentão Verde', price: 4.00, quantity: 0, imageurl: 'assets/images/pimentaoVerde.png' },
    { id: 5, name: 'Maçã', price: 5.00, quantity: 0, imageurl: 'assets/images/maca.png' },
    { id: 6, name: 'Banana', price: 3.00, quantity: 0, imageurl: 'assets/images/banana.png' },
    { id: 7, name: 'Laranja', price: 4.00, quantity: 0, imageurl: 'assets/images/laranja.png' },
    { id: 8, name: 'Morango', price: 10.00, quantity: 0, imageurl: 'assets/images/morango.png' },
  ];
  cart: Product[] = [];
  totalItems = 0;
  isCartModalOpen = false;
  isPaymentView = false;
  isPixPayment = false;
  isCardPayment = false;

  constructor(
    private modalController: ModalController,
    private alertController: AlertController,
    private navCtrl: NavController,
    private baseService: BaseService
  ) { }

  ngOnInit() {}

  addToCart(product: Product) {
    this.totalItems++;
    const cartItem = this.cart.find((item) => item.id === product.id);
    if (cartItem) {
      cartItem.quantity++;
    } else {
      this.cart.push({ ...product, quantity: 1 });
    }
  }

  removeFromCart(product: Product) {
    const cartItem = this.cart.find((item) => item.id === product.id);
    if (cartItem) {
      cartItem.quantity--;
      if (cartItem.quantity === 0) {
        this.cart = this.cart.filter((item) => item.id !== product.id);
      }
      this.totalItems--;
    }
  }

  calculateTotal(): number {
    return this.cart.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  openCartModal() {
    this.isCartModalOpen = true;
  }

  closeCartModal() {
    this.isCartModalOpen = false;
    this.isPaymentView = false;
    this.isPixPayment = false;
    this.isCardPayment = false;
  }

  cancelPurchase() {
    this.cart = [];
    this.totalItems = 0;
    this.closeCartModal();
  }

  showPaymentOptions() {
    console.log("Exibindo opções de pagamento");
    this.isPaymentView = true;
  }

  selectPixPayment() {
    console.log("Selecionado pagamento via Pix");
    this.isPixPayment = true;
    this.isCardPayment = false;
  }

  selectCardPayment() {
    console.log("Selecionado pagamento via Cartão");
    this.isCardPayment = true;
    this.isPixPayment = false;
  }

  async copyPixCode() {
    const pixCode = "123456789PIXCODE";
    await navigator.clipboard.writeText(pixCode);
    const alert = await this.alertController.create({
      header: 'Copiado!',
      message: 'O código Pix foi copiado com sucesso!',
      buttons: ['OK'],
    });
    await alert.present();
    setTimeout(async () => {
      const successAlert = await this.alertController.create({
        header: 'Sucesso!',
        message: 'Pagamento efetuado com sucesso!',
        buttons: ['OK'],
      });
      await successAlert.present();
      this.closeCartModal();
      this.navCtrl.navigateRoot('/products');
    }, 15000);
  }

  async confirmCardPayment() {
    const alert = await this.alertController.create({
      header: 'Sucesso!',
      message: 'Pagamento efetuado com sucesso!',
      buttons: ['OK'],
    });
    await alert.present();
    this.closeCartModal();
    this.navCtrl.navigateRoot('/products');
  }
}
