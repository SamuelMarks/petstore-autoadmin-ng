import { TestBed, fail } from "@angular/core/testing";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { UserService } from "./user.service";
import { User } from "../models";
import { BASE_PATH_DEFAULT } from "../tokens";
describe('UserService', () => {
    let service: UserService;
    let httpMock: HttpTestingController;
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                UserService,
                { provide: BASE_PATH_DEFAULT, useValue: '/api/v1' }

            ]
        });
        service = TestBed.inject(UserService);
        httpMock = TestBed.inject(HttpTestingController);
    });
    afterEach(() => {
        httpMock.verify();
    });
    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('createUsersWithListInput()', () => {
        it('should return any on success', () => {
            const mockResponse = null;
            const user: User = { "id": 123, "username": "string-value", "firstName": "string-value", "lastName": "string-value", "email": "string-value", "password": "string-value", "phone": "string-value", "userStatus": 123 };
            service.createUsersWithListInput(user).subscribe(response => expect(response).toEqual(mockResponse));
            const req = httpMock.expectOne(`/api/v1/user/createWithList`);
            expect(req.request.method).toBe('POST');
            expect(req.request.body).toEqual(user);
            req.flush(mockResponse);
        });
        it('should handle a 404 error', () => {
            const user: User = { "id": 123, "username": "string-value", "firstName": "string-value", "lastName": "string-value", "email": "string-value", "password": "string-value", "phone": "string-value", "userStatus": 123 };
            service.createUsersWithListInput(user).subscribe({
                next: () => fail('should have failed with a 404 error'),
                error: error => expect(error.status).toBe(404),
            });
            const req = httpMock.expectOne(`/api/v1/user/createWithList`);
            req.flush('Not Found', { status: 404, statusText: 'Not Found' });
        });
    });

    describe('getUserByName()', () => {
        it('should return User on success', () => {
            const mockResponse: User = { "id": 123, "username": "string-value", "firstName": "string-value", "lastName": "string-value", "email": "string-value", "password": "string-value", "phone": "string-value", "userStatus": 123 };
            const username = 'test-username';
            service.getUserByName(username).subscribe(response => expect(response).toEqual(mockResponse));
            const req = httpMock.expectOne(`/api/v1/user/${username}`);
            expect(req.request.method).toBe('GET');
            req.flush(mockResponse);
        });
        it('should handle a 404 error', () => {
            const username = 'test-username';
            service.getUserByName(username).subscribe({
                next: () => fail('should have failed with a 404 error'),
                error: error => expect(error.status).toBe(404),
            });
            const req = httpMock.expectOne(`/api/v1/user/${username}`);
            req.flush('Not Found', { status: 404, statusText: 'Not Found' });
        });
    });

    describe('updateUser()', () => {
        it('should return any on success', () => {
            const mockResponse = null;
            const user: User = { "id": 123, "username": "string-value", "firstName": "string-value", "lastName": "string-value", "email": "string-value", "password": "string-value", "phone": "string-value", "userStatus": 123 };
            const username = 'test-username';
            service.updateUser(username, user).subscribe(response => expect(response).toEqual(mockResponse));
            const req = httpMock.expectOne(`/api/v1/user/${username}`);
            expect(req.request.method).toBe('PUT');
            expect(req.request.body).toEqual(user);
            req.flush(mockResponse);
        });
        it('should handle a 404 error', () => {
            const user: User = { "id": 123, "username": "string-value", "firstName": "string-value", "lastName": "string-value", "email": "string-value", "password": "string-value", "phone": "string-value", "userStatus": 123 };
            const username = 'test-username';
            service.updateUser(username, user).subscribe({
                next: () => fail('should have failed with a 404 error'),
                error: error => expect(error.status).toBe(404),
            });
            const req = httpMock.expectOne(`/api/v1/user/${username}`);
            req.flush('Not Found', { status: 404, statusText: 'Not Found' });
        });
    });

    describe('deleteUser()', () => {
        it('should return any on success', () => {
            const mockResponse = null;
            const username = 'test-username';
            service.deleteUser(username).subscribe(response => expect(response).toEqual(mockResponse));
            const req = httpMock.expectOne(`/api/v1/user/${username}`);
            expect(req.request.method).toBe('DELETE');
            req.flush(mockResponse);
        });
        it('should handle a 404 error', () => {
            const username = 'test-username';
            service.deleteUser(username).subscribe({
                next: () => fail('should have failed with a 404 error'),
                error: error => expect(error.status).toBe(404),
            });
            const req = httpMock.expectOne(`/api/v1/user/${username}`);
            req.flush('Not Found', { status: 404, statusText: 'Not Found' });
        });
    });

    describe('loginUser()', () => {
        it('should return string on success', () => {
            const mockResponse = null;
            const username = 'test-username';
            const password = 'test-password';
            service.loginUser(username, password).subscribe(response => expect(response).toEqual(mockResponse));
            const req = httpMock.expectOne(`/api/v1/user/login`);
            expect(req.request.method).toBe('GET');
            req.flush(mockResponse);
        });
        it('should handle a 404 error', () => {
            const username = 'test-username';
            const password = 'test-password';
            service.loginUser(username, password).subscribe({
                next: () => fail('should have failed with a 404 error'),
                error: error => expect(error.status).toBe(404),
            });
            const req = httpMock.expectOne(`/api/v1/user/login`);
            req.flush('Not Found', { status: 404, statusText: 'Not Found' });
        });
    });

    describe('logoutUser()', () => {
        it('should return any on success', () => {
            const mockResponse = null;
            service.logoutUser().subscribe(response => expect(response).toEqual(mockResponse));
            const req = httpMock.expectOne(`/api/v1/user/logout`);
            expect(req.request.method).toBe('GET');
            req.flush(mockResponse);
        });
        it('should handle a 404 error', () => {
            service.logoutUser().subscribe({
                next: () => fail('should have failed with a 404 error'),
                error: error => expect(error.status).toBe(404),
            });
            const req = httpMock.expectOne(`/api/v1/user/logout`);
            req.flush('Not Found', { status: 404, statusText: 'Not Found' });
        });
    });

    describe('createUsersWithArrayInput()', () => {
        it('should return any on success', () => {
            const mockResponse = null;
            const user: User = { "id": 123, "username": "string-value", "firstName": "string-value", "lastName": "string-value", "email": "string-value", "password": "string-value", "phone": "string-value", "userStatus": 123 };
            service.createUsersWithArrayInput(user).subscribe(response => expect(response).toEqual(mockResponse));
            const req = httpMock.expectOne(`/api/v1/user/createWithArray`);
            expect(req.request.method).toBe('POST');
            expect(req.request.body).toEqual(user);
            req.flush(mockResponse);
        });
        it('should handle a 404 error', () => {
            const user: User = { "id": 123, "username": "string-value", "firstName": "string-value", "lastName": "string-value", "email": "string-value", "password": "string-value", "phone": "string-value", "userStatus": 123 };
            service.createUsersWithArrayInput(user).subscribe({
                next: () => fail('should have failed with a 404 error'),
                error: error => expect(error.status).toBe(404),
            });
            const req = httpMock.expectOne(`/api/v1/user/createWithArray`);
            req.flush('Not Found', { status: 404, statusText: 'Not Found' });
        });
    });

    describe('createUser()', () => {
        it('should return any on success', () => {
            const mockResponse = null;
            const user: User = { "id": 123, "username": "string-value", "firstName": "string-value", "lastName": "string-value", "email": "string-value", "password": "string-value", "phone": "string-value", "userStatus": 123 };
            service.createUser(user).subscribe(response => expect(response).toEqual(mockResponse));
            const req = httpMock.expectOne(`/api/v1/user`);
            expect(req.request.method).toBe('POST');
            expect(req.request.body).toEqual(user);
            req.flush(mockResponse);
        });
        it('should handle a 404 error', () => {
            const user: User = { "id": 123, "username": "string-value", "firstName": "string-value", "lastName": "string-value", "email": "string-value", "password": "string-value", "phone": "string-value", "userStatus": 123 };
            service.createUser(user).subscribe({
                next: () => fail('should have failed with a 404 error'),
                error: error => expect(error.status).toBe(404),
            });
            const req = httpMock.expectOne(`/api/v1/user`);
            req.flush('Not Found', { status: 404, statusText: 'Not Found' });
        });
    });
});
