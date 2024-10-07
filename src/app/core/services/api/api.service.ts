import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { catchError, of, throwError } from 'rxjs';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})

export class ApiService {
  token: string;
  userData: any;
  fcmToken: any;

  constructor(private http: HttpClient) {
    this.getLocalStorageData();
  }
  
  getLocalStorageData(): Observable<any> {
    const userData = JSON.parse(localStorage.getItem('user_data') || 'null');
    console.log('hello data', userData);
    return of(userData);
  }
  updateNotificationPreferences(data): Observable<any>{
    return this.postApi('notification/set-reminder',data);
  }
  login(data: any) {
    return this.http.post(`${environment.baseUrl}/auth/login`, data);
  }
  getAllProduct(page: number = 1, searchText: string = ''){
    let url = `/product/all?page=${page}`;
    if (searchText) {
      url += `&search_text=${encodeURIComponent(searchText)}`;
    }
    return this.getApi(url);
  }
  getProductDetails(id){
    return this.getApi(`product/details/${id}`);
  }
  deleteProduct(id){
    return this.deleteApi(`product/delete/${id}`);
  }
  deleteAccount(){
    return this.deleteApi("user/delete");
  }
  getAllCatgoryItem(id){
    return this.getApi(`category/items/${id}`);
  }
  getAllCategory(searchText: string = '') {
    let url = '/category/all';
    if (searchText) {
      url += `?search_text=${encodeURIComponent(searchText)}`;
    }
    return this.getApi(url);
}
  getAllAds(){
    return this.getApi('ad/all');
  }
  getAllFaq(){
    return this.getApi('user/faq/all');
  }
  addCategory(data){
    return this.postApi('category/add',data);
  }
  sendFeedBack(data){
    return this.postApi('user/create-feedback',data);
  }
  changeUserEmail(data){
    return this.postApi('user/change-email',data);
  }
  changeUserPassword(data){
    return this.postApi('user/update-password',data);
  }
  getCategory(){
    return this.getApi('category/all');
  }
  addProduct(data){
    return this.postApi('product/create', data);
  }
  forgotPassword(data: any) {
    return this.http.post(`${environment.baseUrl}auth/forget-password`, data);
  }
  resendOTP(data: any) {
    return this.http.post(`${environment.baseUrl}auth/resend-otp`, data);
  }
  resetPassword(data: any) {
    return this.http.post(`${environment.baseUrl}auth/reset-password`, data);
  }
  verifyOtp(data) {
    return this.http.post(`${environment.baseUrl}auth/verify-otp`, data);
  }
  signup(data) {
    return this.http.post(`${environment.baseUrl}auth/signup`, data)
  }
  getUserData(){
    return this.getApi('user/profile');
  }
  updateUserProfile(data){
    return this.postApi('user/update/profile',data);
  }
  getHttpHeaders() {
    const data = JSON.parse(localStorage.getItem('user_data'));
    if (data?.token) {
      this.token = data.token;
    } else if (data) {
      this.token = data.token;
    }
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.token}`,
      }),
    };
  }
  
  getApi(url: string): Observable<any> {
    return this.http.get(`${environment.baseUrl}${url}`, this.getHttpHeaders());
  }
  postApi(url: any, formData: any) {
    return this.http.post(`${environment.baseUrl}${url}`, formData, this.getHttpHeaders());
  }
  postUpdateApi(url: any) {
    return this.http.post(`${environment.baseUrl}${url}`, {}, this.getHttpHeaders());
  }
  deleteApi(url: string): Observable<any> {
    return this.http.delete(`${environment.baseUrl}${url}`, this.getHttpHeaders());
  }
}