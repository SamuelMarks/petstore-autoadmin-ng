import { fail, TestBed } from "@angular/core/testing";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { PetService } from "./pet.service";
import { ApiResponse, Pet } from "../models";
import { BASE_PATH_DEFAULT } from "../tokens";

describe('PetService', () => {
  let service: PetService;
  let httpMock: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        PetService,
        { provide: BASE_PATH_DEFAULT, useValue: '/api/v1' }

      ]
    });
    service = TestBed.inject(PetService);
    httpMock = TestBed.inject(HttpTestingController);
  });
  afterEach(() => {
    httpMock.verify();
  });
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('uploadFile()', () => {
    it('should return ApiResponse on success', () => {
      const mockResponse: ApiResponse = { "code": 123, "type": "string-value", "message": "string-value" };
      const petId = 123;
      const additionalMetadata = 'test-additionalMetadata';
      const file = 'test-file';
      service.uploadFile(petId, additionalMetadata, file).subscribe(response => expect(response).toEqual(mockResponse));
      const req = httpMock.expectOne(`/api/v1/pet/${petId}/uploadImage`);
      expect(req.request.method).toBe('POST');
      req.flush(mockResponse);
    });
    it('should handle a 404 error', () => {
      const petId = 123;
      const additionalMetadata = 'test-additionalMetadata';
      const file = 'test-file';
      service.uploadFile(petId, additionalMetadata, file).subscribe({
        next: () => fail('should have failed with a 404 error'),
        error: error => expect(error.status).toBe(404),
      });
      const req = httpMock.expectOne(`/api/v1/pet/${petId}/uploadImage`);
      req.flush('Not Found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('addPet()', () => {
    it('should return any on success', () => {
      const mockResponse = null;
      const pet: Pet = {
        "id": 123,
        "category": { "id": 123, "name": "string-value" },
        "name": "doggie",
        "photoUrls": ["string-value"],
        "tags": [{ "id": 123, "name": "string-value" }],
        "status": "string-value"
      };
      service.addPet(pet).subscribe(response => expect(response).toEqual(mockResponse));
      const req = httpMock.expectOne(`/api/v1/pet`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(pet);
      req.flush(mockResponse);
    });
    it('should handle a 404 error', () => {
      const pet: Pet = {
        "id": 123,
        "category": { "id": 123, "name": "string-value" },
        "name": "doggie",
        "photoUrls": ["string-value"],
        "tags": [{ "id": 123, "name": "string-value" }],
        "status": "string-value"
      };
      service.addPet(pet).subscribe({
        next: () => fail('should have failed with a 404 error'),
        error: error => expect(error.status).toBe(404),
      });
      const req = httpMock.expectOne(`/api/v1/pet`);
      req.flush('Not Found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('updatePet()', () => {
    it('should return any on success', () => {
      const mockResponse = null;
      const pet: Pet = {
        "id": 123,
        "category": { "id": 123, "name": "string-value" },
        "name": "doggie",
        "photoUrls": ["string-value"],
        "tags": [{ "id": 123, "name": "string-value" }],
        "status": "string-value"
      };
      service.updatePet(pet).subscribe(response => expect(response).toEqual(mockResponse));
      const req = httpMock.expectOne(`/api/v1/pet`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(pet);
      req.flush(mockResponse);
    });
    it('should handle a 404 error', () => {
      const pet: Pet = {
        "id": 123,
        "category": { "id": 123, "name": "string-value" },
        "name": "doggie",
        "photoUrls": ["string-value"],
        "tags": [{ "id": 123, "name": "string-value" }],
        "status": "string-value"
      };
      service.updatePet(pet).subscribe({
        next: () => fail('should have failed with a 404 error'),
        error: error => expect(error.status).toBe(404),
      });
      const req = httpMock.expectOne(`/api/v1/pet`);
      req.flush('Not Found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('findPetsByStatus()', () => {
    it('should return Pet[] on success', () => {
      const mockResponse: Pet[] = [{
        "id": 123,
        "category": { "id": 123, "name": "string-value" },
        "name": "doggie",
        "photoUrls": ["string-value"],
        "tags": [{ "id": 123, "name": "string-value" }],
        "status": "string-value"
      }];
      const status = 'test-status';
      service.findPetsByStatus(status).subscribe(response => expect(response).toEqual(mockResponse));
      const req = httpMock.expectOne(`/api/v1/pet/findByStatus`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
    it('should handle a 404 error', () => {
      const status = 'test-status';
      service.findPetsByStatus(status).subscribe({
        next: () => fail('should have failed with a 404 error'),
        error: error => expect(error.status).toBe(404),
      });
      const req = httpMock.expectOne(`/api/v1/pet/findByStatus`);
      req.flush('Not Found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('findPetsByTags()', () => {
    it('should return Pet[] on success', () => {
      const mockResponse: Pet[] = [{
        "id": 123,
        "category": { "id": 123, "name": "string-value" },
        "name": "doggie",
        "photoUrls": ["string-value"],
        "tags": [{ "id": 123, "name": "string-value" }],
        "status": "string-value"
      }];
      const tags = 'test-tags';
      service.findPetsByTags(tags).subscribe(response => expect(response).toEqual(mockResponse));
      const req = httpMock.expectOne(`/api/v1/pet/findByTags`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
    it('should handle a 404 error', () => {
      const tags = 'test-tags';
      service.findPetsByTags(tags).subscribe({
        next: () => fail('should have failed with a 404 error'),
        error: error => expect(error.status).toBe(404),
      });
      const req = httpMock.expectOne(`/api/v1/pet/findByTags`);
      req.flush('Not Found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('getPetById()', () => {
    it('should return Pet on success', () => {
      const mockResponse: Pet = {
        "id": 123,
        "category": { "id": 123, "name": "string-value" },
        "name": "doggie",
        "photoUrls": ["string-value"],
        "tags": [{ "id": 123, "name": "string-value" }],
        "status": "string-value"
      };
      const petId = 123;
      service.getPetById(petId).subscribe(response => expect(response).toEqual(mockResponse));
      const req = httpMock.expectOne(`/api/v1/pet/${petId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
    it('should handle a 404 error', () => {
      const petId = 123;
      service.getPetById(petId).subscribe({
        next: () => fail('should have failed with a 404 error'),
        error: error => expect(error.status).toBe(404),
      });
      const req = httpMock.expectOne(`/api/v1/pet/${petId}`);
      req.flush('Not Found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('updatePetWithForm()', () => {
    it('should return any on success', () => {
      const mockResponse = null;
      const petId = 123;
      const name = 'test-name';
      const status = 'test-status';
      service.updatePetWithForm(petId, name, status).subscribe(response => expect(response).toEqual(mockResponse));
      const req = httpMock.expectOne(`/api/v1/pet/${petId}`);
      expect(req.request.method).toBe('POST');
      req.flush(mockResponse);
    });
    it('should handle a 404 error', () => {
      const petId = 123;
      const name = 'test-name';
      const status = 'test-status';
      service.updatePetWithForm(petId, name, status).subscribe({
        next: () => fail('should have failed with a 404 error'),
        error: error => expect(error.status).toBe(404),
      });
      const req = httpMock.expectOne(`/api/v1/pet/${petId}`);
      req.flush('Not Found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('deletePet()', () => {
    it('should return any on success', () => {
      const mockResponse = null;
      const apiKey = 'test-api_key';
      const petId = 123;
      service.deletePet(apiKey, petId).subscribe(response => expect(response).toEqual(mockResponse));
      const req = httpMock.expectOne(`/api/v1/pet/${petId}`);
      expect(req.request.method).toBe('DELETE');
      req.flush(mockResponse);
    });
    it('should handle a 404 error', () => {
      const apiKey = 'test-api_key';
      const petId = 123;
      service.deletePet(apiKey, petId).subscribe({
        next: () => fail('should have failed with a 404 error'),
        error: error => expect(error.status).toBe(404),
      });
      const req = httpMock.expectOne(`/api/v1/pet/${petId}`);
      req.flush('Not Found', { status: 404, statusText: 'Not Found' });
    });
  });
});
