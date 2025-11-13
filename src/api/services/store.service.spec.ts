import { fail, TestBed } from "@angular/core/testing";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { StoreService } from "./store.service";
import { Order } from "../models";
import { BASE_PATH_DEFAULT } from "../tokens";

describe('StoreService', () => {
  let service: StoreService;
  let httpMock: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        StoreService,
        { provide: BASE_PATH_DEFAULT, useValue: '/api/v1' }

      ]
    });
    service = TestBed.inject(StoreService);
    httpMock = TestBed.inject(HttpTestingController);
  });
  afterEach(() => {
    httpMock.verify();
  });
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getInventory()', () => {
    it('should return Record<string, number> on success', () => {
      const mockResponse = null;
      service.getInventory().subscribe(response => expect(response).toEqual(mockResponse));
      const req = httpMock.expectOne(`/api/v1/store/inventory`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
    it('should handle a 404 error', () => {
      service.getInventory().subscribe({
        next: () => fail('should have failed with a 404 error'),
        error: error => expect(error.status).toBe(404),
      });
      const req = httpMock.expectOne(`/api/v1/store/inventory`);
      req.flush('Not Found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('placeOrder()', () => {
    it('should return Order on success', () => {
      const mockResponse: Order = {
        "id": 123,
        "petId": 123,
        "quantity": 123,
        "shipDate": "2025-11-13T20:12:46.054Z",
        "status": "string-value",
        "complete": true
      };
      const order: Order = {
        "id": 123,
        "petId": 123,
        "quantity": 123,
        "shipDate": "2025-11-13T20:12:46.055Z",
        "status": "string-value",
        "complete": true
      };
      service.placeOrder(order).subscribe(response => expect(response).toEqual(mockResponse));
      const req = httpMock.expectOne(`/api/v1/store/order`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(order);
      req.flush(mockResponse);
    });
    it('should handle a 404 error', () => {
      const order: Order = {
        "id": 123,
        "petId": 123,
        "quantity": 123,
        "shipDate": "2025-11-13T20:12:46.055Z",
        "status": "string-value",
        "complete": true
      };
      service.placeOrder(order).subscribe({
        next: () => fail('should have failed with a 404 error'),
        error: error => expect(error.status).toBe(404),
      });
      const req = httpMock.expectOne(`/api/v1/store/order`);
      req.flush('Not Found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('getOrderById()', () => {
    it('should return Order on success', () => {
      const mockResponse: Order = {
        "id": 123,
        "petId": 123,
        "quantity": 123,
        "shipDate": "2025-11-13T20:12:46.055Z",
        "status": "string-value",
        "complete": true
      };
      const orderId = 123;
      service.getOrderById(orderId).subscribe(response => expect(response).toEqual(mockResponse));
      const req = httpMock.expectOne(`/api/v1/store/order/${orderId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
    it('should handle a 404 error', () => {
      const orderId = 123;
      service.getOrderById(orderId).subscribe({
        next: () => fail('should have failed with a 404 error'),
        error: error => expect(error.status).toBe(404),
      });
      const req = httpMock.expectOne(`/api/v1/store/order/${orderId}`);
      req.flush('Not Found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('deleteOrder()', () => {
    it('should return any on success', () => {
      const mockResponse = null;
      const orderId = 123;
      service.deleteOrder(orderId).subscribe(response => expect(response).toEqual(mockResponse));
      const req = httpMock.expectOne(`/api/v1/store/order/${orderId}`);
      expect(req.request.method).toBe('DELETE');
      req.flush(mockResponse);
    });
    it('should handle a 404 error', () => {
      const orderId = 123;
      service.deleteOrder(orderId).subscribe({
        next: () => fail('should have failed with a 404 error'),
        error: error => expect(error.status).toBe(404),
      });
      const req = httpMock.expectOne(`/api/v1/store/order/${orderId}`);
      req.flush('Not Found', { status: 404, statusText: 'Not Found' });
    });
  });
});
