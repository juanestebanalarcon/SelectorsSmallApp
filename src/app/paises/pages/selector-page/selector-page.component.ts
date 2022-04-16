import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaisesService } from '../../services/paises-service.service';
import { PaisSmall } from '../../interfaces/paises.interface';
import { switchMap, tap } from "rxjs/operators";

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styles: [`
  `]
})
export class SelectorPageComponent implements OnInit {

formularioPaises:FormGroup=this.fb.group({
  region:['',[Validators.required]],
  pais:['',[Validators.required]],
  frontera:['',[Validators.required]],
})

//Llenar selectores:
regiones:string[]=[];
paises:PaisSmall[]=[];
//fronteras:string[]=[];
fronteras:PaisSmall[]=[];

//UI
cargando:boolean=false;

  constructor(private fb: FormBuilder, private paisesService:PaisesService) { }

  ngOnInit(): void {
    this.regiones=this.paisesService.regiones;
    //Region changes:
/* 
    this.formularioPaises.get('region')?.valueChanges.subscribe(region =>{
      this.paisesService.getPaisesPorRegion(region).subscribe(paises=>{
        this.paises=paises;
      })
    })
*/
//Si cambia la región se formatea el campo país:
this.formularioPaises.get('region')?.valueChanges
.pipe(
  tap( (_) =>{
    this.formularioPaises.get('pais')?.reset('');
    this.cargando=true;
    //this.formularioPaises.get('frontera')?.disable();
  } ), 
  switchMap(region =>this.paisesService.getPaisesPorRegion(region)))
  .subscribe(paises=>{
    this.paises=paises
    this.cargando=false;
  })
  //Si cambia el país se formatea el campo frontera:
  this.formularioPaises.get('pais')?.valueChanges.pipe(
    tap((_)=>{
      //this.fronteras=[];
      this.formularioPaises.get('frontera')?.reset('');
      this.cargando=true;
      //this.formularioPaises.get('frontera')?.enable();
    }),
    switchMap(codigo=>this.paisesService.getPaisPorCodigo(codigo)),
    switchMap(pais=>this.paisesService.getPaisesPorBorders(pais?.borders!))
  ).subscribe(paises=>{
    this.fronteras=paises;
 //   this.fronteras=pais?.borders || [];
    this.cargando=false;
  })
  

}
  
  guardar(){}

}
