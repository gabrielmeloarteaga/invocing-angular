import { InvoiceUseCases } from './../../../../Domain/usecase/Invoice/invoice-use-case';
import { ProductUseCases } from './../../../../Domain/usecase/Product/product-use-case';
import { map, startWith } from 'rxjs/operators';
import { ClientUseCases } from './../../../../Domain/usecase/Client/client-use-case';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnChanges, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { InvoiceRegister } from 'src/app/Domain/Models/Invoice/InvoiceRegister';

@Component({
  selector: 'app-invoice-header',
  templateUrl: './invoice-header.component.html',
  styleUrls: ['./invoice-header.component.css']
})
export class InvoiceHeaderComponent implements OnInit {
  
  myControl = new FormControl();
  options: any[] = [];
  productList: any[] = [];
  formGroup:FormGroup;
  dtoInvoiceRegister = new InvoiceRegister();
     
  filteredOptions;
  filteredProduct;

  constructor(private _getClientUseCase:ClientUseCases, 
    private _getProductUseCase:ProductUseCases,
   private _getInvoiceUseCase:InvoiceUseCases) 
  {     
    this.loadData();
    this.loadProducts();
  }
  response$;
  

  ngOnInit(): void {   
    this.initForm();   
  }



  initForm(){     
      this.formGroup = new FormGroup({
        client: new FormControl(''),
        id: new FormControl('') ,
         document: new FormControl('') , 
         fullname: new FormControl('')  ,
         phone: new FormControl(''),
         product: new FormControl('')
        
      })      
    this.filterClients();
    this.filterProducts();
  }

  loadData() {    
    this._getClientUseCase.getAllClients()   
    .subscribe({
        next: (result: any) => {
          this.options = result;
          this.filteredOptions = result;
        }
      });
  }




  filterClients(){
       //select value
       this.formGroup.get('client').valueChanges.subscribe(response => {
        console.log('data is ', response);
        
        this.dtoInvoiceRegister.Idclient = response.id;
        
        this.document.setValue(response.document);
        this.fullname.setValue(response.firstname+' '+response.lastname);
        this.phone.setValue(response.phone);
  
        this.filterData(response);
      })  
  }

  //filter and and product to detail
  filterProducts(){
    this.formGroup.get('product').valueChanges.subscribe(response => {      
      if(response!='')      
      {
        this.dtoInvoiceRegister.ProductsInvoice.push(response);
      }
      this.filterInputProduct(response);      
    }) 
  }

  loadProducts(){
      this._getProductUseCase.getProducts()   
    .subscribe({
        next: (result: any) => {
          this.productList = result;
          this.filteredProduct = result;          
        }
      });
  }

  filterInputProduct(enteredData){
    this.filteredProduct = this.productList.filter(item => {      
      let  external = item['productname'].indexOf(enteredData) > -1      
      return external;
    })    
  }

  filterData(enteredData){
    this.filteredOptions = this.options.filter(item => {      
      let  external = item['document'].indexOf(enteredData) > -1      
      return external;
    })
      
  }

  

  saveInvoice():any{
    this._getInvoiceUseCase.saveNew(this.dtoInvoiceRegister)   
    .subscribe({
        next: (result: any) => {

        }
      });
   

  }


  get id() { return this.formGroup.get('id'); }
  get document() { return this.formGroup.get('document'); }
  get fullname() { return this.formGroup.get('fullname'); }
  get phone() { return this.formGroup.get('phone'); }
  get client(){return this.formGroup.get('client');}
  get product(){return this.formGroup.get('product');}

}