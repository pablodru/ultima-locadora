import rentalService from "../../src/services/rentals-service";
import rentalRepository from "../../src/repositories/rentals-repository";
import usersRepository from "repositories/users-repository";
import { faker } from "@faker-js/faker";
import moviesRepository from "repositories/movies-repository";

beforeEach(() => {
  jest.clearAllMocks();
})

describe("Rentals Service Unit Tests", () => {
    it("should pass", () => {
        expect(true).toBe(true);
    });
    it("should return error not found on getRentalById", async () => {
        const mock = jest
            .spyOn(rentalRepository, "getRentalById")
            .mockImplementationOnce(() => {
                return undefined;
            });
        const response = rentalService.getRentalById(faker.number.int());
        expect(mock).toBeCalledTimes(1);
        expect(response).rejects.toEqual({
            name: "NotFoundError",
            message: "Rental not found.",
        });
    });
    it("should return not found error on Create Rental", async () => {
        const mock = jest
            .spyOn(usersRepository, "getById")
            .mockImplementationOnce((): any => {
                return undefined;
            });
        const response = rentalService.createRental({
            userId: faker.number.int(),
            moviesId: [faker.number.int()],
        });
        expect(mock).toBeCalledTimes(1);
        expect(response).rejects.toEqual({
            name: "NotFoundError",
            message: "User not found.",
        });
    });
    it("should return pendent rental error on Create Rental", async () => {
        const mock = jest
            .spyOn(usersRepository, "getById")
            .mockImplementationOnce((): any => {
                return {
                    id: faker.number.int(),
                    firstName: faker.person.firstName(),
                    lastName: faker.person.lastName(),
                    email: faker.internet.email(),
                    cpf: "11111111111",
                    birthDate: new Date(),
                };
            });
        const secondMock = jest
            .spyOn(rentalRepository, "getRentalsByUserId")
            .mockImplementationOnce((): any => {
                return [
                    {
                        id: faker.number.int(),
                        date: new Date(),
                        endDate: new Date(),
                        userId: faker.number.int(),
                        closed: faker.datatype.boolean(),
                    },
                ];
            });
        const response = rentalService.createRental({
            userId: faker.number.int(),
            moviesId: [faker.number.int()],
        });
        expect(mock).toBeCalledTimes(1);
        expect(secondMock).toBeCalledTimes(1);
        expect(response).rejects.toEqual({
            name: "PendentRentalError",
            message: "The user already have a rental!",
        });
    });
    it("should return not Found on create Rental", async () => {
        const mock = jest
            .spyOn(usersRepository, "getById")
            .mockImplementationOnce((): any => {
                return {
                    id: faker.number.int(),
                    firstName: faker.person.firstName(),
                    lastName: faker.person.lastName(),
                    email: faker.internet.email(),
                    cpf: "11111111111",
                    birthDate: new Date(),
                };
            });
        const secondMock = jest
            .spyOn(rentalRepository, "getRentalsByUserId")
            .mockImplementationOnce((): any => {
                return [];
            });
        const thirdMock = jest
            .spyOn(moviesRepository, "getById")
            .mockImplementationOnce((): any => {
                return undefined;
            });
        const response = rentalService.createRental({
            userId: faker.number.int(),
            moviesId: [faker.number.int()],
        });
        expect(mock).toBeCalledTimes(1);
        expect(secondMock).toBeCalledTimes(1);
        expect(thirdMock).toBeCalledTimes(1);
        expect(response).rejects.toEqual({
            name: "NotFoundError",
            message: "Movie not found.",
        });
    });
    it("should return movie on Rental on create Rental", async () => {
        const mock = jest
            .spyOn(usersRepository, "getById")
            .mockImplementationOnce((): any => {
                return {
                    id: faker.number.int(),
                    firstName: faker.person.firstName(),
                    lastName: faker.person.lastName(),
                    email: faker.internet.email(),
                    cpf: "11111111111",
                    birthDate: new Date(),
                };
            });
        const secondMock = jest
            .spyOn(rentalRepository, "getRentalsByUserId")
            .mockImplementationOnce((): any => {
                return [];
            });
        const thirdMock = jest
            .spyOn(moviesRepository, "getById")
            .mockImplementationOnce((): any => {
                return [
                    {
                        id: faker.number.int(),
                        name: faker.internet.domainName(),
                        adultsOnly: faker.datatype.boolean(),
                        rentalId: faker.number.int(),
                    },
                ];
            });
        const response = rentalService.createRental({
            userId: faker.number.int(),
            moviesId: [faker.number.int()],
        });
        expect(mock).toBeCalledTimes(1);
        expect(secondMock).toBeCalledTimes(1);
        expect(thirdMock).toBeCalledTimes(1);
        expect(response).rejects.toEqual({
            name: "MovieInRentalError",
            message: "Movie already in a rental.",
        });
    });
    it("should return insuficient age on create Rental", async () => {
        const mock = jest
            .spyOn(usersRepository, "getById")
            .mockImplementationOnce((): any => {
                return {
                    id: faker.number.int(),
                    firstName: faker.person.firstName(),
                    lastName: faker.person.lastName(),
                    email: faker.internet.email(),
                    cpf: "11111111111",
                    birthDate: new Date(),
                };
            });
        const secondMock = jest
            .spyOn(rentalRepository, "getRentalsByUserId")
            .mockImplementationOnce((): any => {
                return [];
            });
        const thirdMock = jest
            .spyOn(moviesRepository, "getById")
            .mockImplementationOnce((): any => {
                return [
                    {
                        id: faker.number.int(),
                        name: faker.internet.domainName(),
                        adultsOnly: false,
                        rentalId: null,
                    },
                ];
            });
        const response = rentalService.createRental({
            userId: faker.number.int(),
            moviesId: [faker.number.int()],
        });
        expect(mock).toBeCalledTimes(1);
        expect(secondMock).toBeCalledTimes(1);
        expect(thirdMock).toBeCalledTimes(1);
        expect(response).rejects.toEqual({
            name: "InsufficientAgeError",
            message: "Cannot see that movie.",
        });
    });
    it("should return not Found on finish rental", async () => {
      const mock = jest.spyOn(rentalRepository, "getRentalById").mockImplementationOnce(() :any => {
        return undefined
      })
      const response = rentalService.finishRental(faker.number.int())
      expect(mock).toBeCalledTimes(1);
      expect(response).rejects.toEqual({
        name: "NotFoundError",
        message: "Rental not found."
      })
    })
});
