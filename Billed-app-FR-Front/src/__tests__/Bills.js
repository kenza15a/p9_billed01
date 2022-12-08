/**
 * @jest-environment jsdom
 */

import { screen, waitFor } from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import { ROUTES_PATH } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store"


import router from "../app/Router.js";
import Bills from "../containers/Bills.js";
jest.mock("../app/store", () => mockStore)
describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      //tester l'icone window
      await waitFor(() => screen.getByTestId('icon-window'))
      const windowIcon = screen.getByTestId('icon-window')
      expect(windowIcon.classList.contains("active-icon")).toBeTruthy();//verifier la classe active-icon

    })

    //tester le loader 
    test('Then, Loading page should be rendered', () => {
      document.body.innerHTML = BillsUI({ loading: true })
      expect(screen.getAllByText('Loading...')).toBeTruthy()
    })
  })
  test("Then bills should be ordered from earliest to latest", () => {
    document.body.innerHTML = BillsUI({ data: bills.sort((a, b) => new Date(b.date) - new Date(a.date)) })
    const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
    const antiChrono = (a, b) => ((a < b) ? 1 : -1)
    const datesSorted = [...dates].sort(antiChrono)
    expect(dates).toEqual(datesSorted)
  })

  //tester le bouton nouvelle note de frais
  /* const refuseButton = screen.getByTestId("btn-refuse-bill-d")
    c*/

  test("A button to add a new bill must be diplayed", () => {
    const Bills = new Bills({ document, onNavigate, store, localStorage });
    const addBillsButton = screen.getByTestId("btn-new-bill");
    expect(addBillsButton).toBeTruthy();
    //verifiant la fonction handleNewBill
    const handleAddNewBill = jest.fn((e) => Bills.handleClickNewBill())
    handleAddNewBill.addEventListener("click", handleAddNewBill)
    fireEvent.click(addBillsButton)
    expect(handleAddNewBill).toHaveBeenCalled()
  })

})


// test d'intégration GET
describe("Given I am a user connected as an employee", () => {

  test("fetches bills from mock API GET", async () => {
    localStorage.setItem("user", JSON.stringify({ type: "employee", email: "a@a" }));
    const root = document.createElement("div")
    root.setAttribute("id", "root")
    document.body.append(root)
    router()
    window.onNavigate(ROUTES_PATH.Bills)
    await waitFor(() => screen.getByText("Mes notes de frais "))


    //verifier l'exisantce de la table
    const billsTab = document.getElementById("data-table");
    expect(billsTab).toBeTruthy()
  })

  //verify icon eye
  describe('Given I am connected as an employee  and I am on Bills page ', () => {
    describe('When I click on the icon eye of a bill', () => {
      test('A modal should open', () => {
        Object.defineProperty(window, 'localStorage', { value: localStorageMock })
        window.localStorage.setItem('user', JSON.stringify({
          type: 'Employee'
        }))

        /*const billUi = new BillsUI();

        const handleClickIconEye = jest.fn(billUi.handleClickIconEye)
        const eye = screen.getByTestId('icon-eye-d')
        eye.addEventListener('click', handleClickIconEye)
        userEvent.click(eye)
        expect(handleClickIconEye).toHaveBeenCalled()

        const modale = screen.getByTestId('modaleFileEmployee')
        expect(modale).toBeTruthy()*/
      })
    })
  })

  //tests d'integration
  describe("When an error occurs on API", () => {
    beforeEach(() => {
      jest.spyOn(mockStore, "bills")
      Object.defineProperty(
        window,
        'localStorage',
        { value: localStorageMock }
      )
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee',
        email: "a@a"
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.appendChild(root)
      router()
    })
    test("fetches bills from an API and fails with 404 message error", async () => {

      mockStore.bills.mockImplementationOnce(() => {
        return {
          list: () => {
            return Promise.reject(new Error("Erreur 404"))
          }
        }
      })
      window.onNavigate(ROUTES_PATH.Bills)
      new Promise(process.nextTick);
      const message = screen.getByTestId("error-message");
      //const message = screen.getByText(/Erreur 404/)
      expect(message).toBeTruthy()
    })

    test("fetches messages from an API and fails with 500 message error", async () => {

      mockStore.bills.mockImplementationOnce(() => {
        return {
          list: () => {
            return Promise.reject(new Error("Erreur 500"))
          }
        }
      })

      window.onNavigate(ROUTES_PATH.Dashboard)
      await new Promise(process.nextTick);
      const message = screen.getByTestId("error-message");
      expect(message).toBeTruthy()
    })
  })

})
