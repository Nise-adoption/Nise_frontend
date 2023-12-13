import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Animal } from './animal';
import { Protectora } from '../usuarios-module/protectora';

@Injectable({
  providedIn: 'root'
})
export class AnimalService {

  private animalSeleccionadoSubject: BehaviorSubject<Animal | null>= new BehaviorSubject<Animal | null>(null);
  private animalSeleccionado$: Observable<Animal | null> = this.animalSeleccionadoSubject.asObservable();

  constructor(private httpClient: HttpClient) {}

  private animalURL= "http://localhost:8080/animal";
  private animalProtectoraURL= "http://localhost:8080/animal/protectorasanimal"
  private animalingresosURL= "http://localhost:8080/animal/ingresos"
  private animaladopcionURL= "http://localhost:8080/animal/adopcion"
  private animalesultimosURL= "http://localhost:8080/animal/ultimo"

  //LISTAR
  getAnimalList(): Observable<Animal[]>{
    return this.httpClient.get<Animal[]>(`${this.animalURL}`);
  }

  //LISTAR ONE BY ONE -- DETAIL
  getAnimalById(id: number): Observable<Animal>{
    return this.httpClient.get<Animal>(`${this.animalURL}/${id}`);
  }

  getAnimalByProtectora() : Observable<Animal[]>{
    let parametros = new HttpParams();
    parametros = parametros.append('id', localStorage.getItem('id')!);
    const opciones = {
      params : parametros
    }
    return this.httpClient.get<Animal[]>(`${this.animalProtectoraURL}`, opciones);
  }

  getIngresos() : Observable<Animal[]>{
    let parametros = new HttpParams();
    parametros = parametros.append('id', localStorage.getItem('id')!);
    const opciones = {
      params : parametros
    }
    return this.httpClient.get<Animal[]>(`${this.animalingresosURL}`, opciones);
  }

  getAdopcion() : Observable<Animal[]>{
    let parametros = new HttpParams();
    parametros = parametros.append('id', localStorage.getItem('id')!);
    const opciones = {
      params : parametros
    }
    return this.httpClient.get<Animal[]>(`${this.animaladopcionURL}`, opciones);
  }

   //LISTAR ULTIMOS ANIMALES
   getAnimalesList(): Observable<Animal[]>{
    return this.httpClient.get<Animal[]>(`${this.animalesultimosURL}`);
  }



  //CREAR
  createAnimal(animal: Animal, imagen: File): Observable<any>{
    const formData = new FormData();

    const animalToSend = {
      nombre: animal.nombre,
      descripcion: animal.descripcion,
      raza: animal.raza,
      edad: animal.edad,
      disponibilidad: animal.disponibilidad,
      chip: animal.chip,
      tipoAnimal: animal.tipoAnimal,
      tipoSexo: animal.tipoSexo,
      tipoTamanyo: animal.tipoTamanyo,
      fechaEntradaProtectora: animal.fechaEntradaProtectora
    };

    formData.append('imagen', imagen, imagen.name);

    const animalString = JSON.stringify(animalToSend);

    formData.append('animal', animalString);

    const gestionString = JSON.stringify(this.getUserData());

    formData.append('gestion', gestionString);

    const gestionRole = this.getUserRole();

    formData.append('rol', gestionRole);

    return this.httpClient.post(`${this.animalURL}`, formData);
  }

  //EDITAR
  updateAnimal(id: number, animal: Animal): Observable<Object>{
    return this.httpClient.put<Animal>(`${this.animalURL}/${id}`, animal);

  }

  //BORRAR
  deleteAnimal(id: number): Observable<Object>{
    return this.httpClient.delete<Animal>(`${this.animalURL}/${id}`);
  }

  //INTERFAZ USUARIO
  mostrarPerros(): Observable<Animal[]>{
    return this.httpClient.get<Animal[]>(`${this.animalURL}/buscar/tipo?tipoAnimal=0`)
  }

  mostrarGatos(): Observable<Animal[]>{
    return this.httpClient.get<Animal[]>(`${this.animalURL}/buscar/tipo?tipoAnimal=1`)
  }

  mostrarOtros(): Observable<Animal[]>{
    return this.httpClient.get<Animal[]>(`${this.animalURL}/buscar/tipo?tipoAnimal=2`)
  }

  mostrarPerrosDetail(id: number): Observable<Animal>{
    return this.httpClient.get<Animal>(`${this.animalURL}/buscar/tipo/${id}?tipoAnimal=0`);
  }

  mostrarGatosDetail(id: number): Observable<Animal>{
    return this.httpClient.get<Animal>(`${this.animalURL}/buscar/tipo/${id}?tipoAnimal=1`);
  }

  mostrarOtrosDetail(id: number): Observable<Animal>{
    return this.httpClient.get<Animal>(`${this.animalURL}/buscar/tipo/${id}?tipoAnimal=2`);
  }

  //FILTRO
  filtroRaza(raza: string): Observable<Animal[]> {
    return this.httpClient.get<Animal[]>(`${this.animalURL}/filtros?raza=${raza}&tipoAnimal=0`);
  }

  filtroRaza1(raza: string): Observable<Animal[]> {
    return this.httpClient.get<Animal[]>(`${this.animalURL}/filtros?raza=${raza}&tipoAnimal=1`);
  }


  filtroRaza2(raza: string): Observable<Animal[]> {
    return this.httpClient.get<Animal[]>(`${this.animalURL}/filtros?raza=${raza}&tipoAnimal=2`);
  }


filtroSexoTamanyoYTipoAnimal(sexo: string, tamanyo: string, tipoAnimal: string): Observable<Animal[]> {
  return this.httpClient.get<Animal[]>(`${this.animalURL}/filtros?sexo=${sexo}&tipoTamanyo=${tamanyo}&tipoAnimal=${tipoAnimal}`);
  }
  getUserData(): number {
    const userDataID = JSON.parse(localStorage.getItem('id')!);
    console.log(userDataID);
    return userDataID;
  }

  getUserRole(): string {
    let userDataRole = JSON.parse(localStorage.getItem('dato')!);
    return userDataRole.rol;
  }
}