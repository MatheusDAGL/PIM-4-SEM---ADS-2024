import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController, NavController } from '@ionic/angular';
import { Product } from '../interfaces/product.interface';
import { BaseService } from '../services/base.service';
import { HttpClient } from '@angular/common/http';
import { timer } from 'rxjs'; // Adicionei a importação do 'timer'

@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
})
export class ProductsPage implements OnInit {
  products: Product[] = [];
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
    private baseService: BaseService,
    private http: HttpClient // Removi a vírgula final
  ) { }

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.baseService.getProducts().subscribe(
      (data: Product[]) => {
        this.products = data;
      },
      (error) => {
        console.error('Erro ao carregar produtos', error);
      }
    );
  }

  calculateTotal(): number {
    return this.cart.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  addToCart(product: Product) {
    this.totalItems++;
    const cartItem = this.cart.find((item) => item.id === product.id);
    if (cartItem) {
      cartItem.quantity++;
    } else {
      this.cart.push({ ...product, quantity: 1 });
    }
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
    this.isPaymentView = true;
  }

  selectPixPayment() {
    this.isPixPayment = true;
    this.isCardPayment = false;
  }

  selectCardPayment() {
    this.isCardPayment = true;
    this.isPixPayment = false;
  }

  async copyPixCode() {
    const pixCode = "123456789PIXCODE";
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(pixCode);
    } else {
      console.error('Clipboard API not supported');
      return;
    }

    const alert = await this.alertController.create({
      header: 'Copiado!',
      message: 'O código Pix foi copiado com sucesso!',
      buttons: ['OK'],
    });
    await alert.present();

    const purchaseDetails = {
      product: 'Produto X',
      quantity: 3,
      payment: 'Cartão de Crédito'
    };

    this.http.post('http://localhost:8000/product.php', purchaseDetails).subscribe(
      response => console.log('Compra registrada:', response),
      error => console.error('Erro ao registrar compra:', error)
    );

    timer(15000).subscribe(async () => {
      const successAlert = await this.alertController.create({
        header: 'Sucesso!',
        message: 'Pagamento efetuado com sucesso!',
        buttons: ['OK'],
      });
      await successAlert.present();
      this.closeCartModal();
      this.navCtrl.navigateRoot('/products');
    });
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
