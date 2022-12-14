/**
 * @jest-environment jsdom
 */

import { screen, waitFor } from "@testing-library/dom"
import { fireEvent } from "@testing-library/dom";
//import userEvent from "@testing-library/user-event";
import mockStore from "../__mocks__/store"
import router from "../app/Router.js";
import { ROUTES, ROUTES_PATH } from "../constants/routes";
import NewBillUI from "../views/NewBillUI.js";
import { localStorageMock } from "../__mocks__/localStorage";

jest.mock("../app/store", () => mockStore)
describe("Given I am connected as an employee", () => {

  describe("When I am on NewBill Page", () => {
    test("Then mail icon in vertical layout should be highlighted", async () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({ type: 'Employee' }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.NewBill)
      await waitFor(() => screen.getByTestId('icon-mail'))
      const mailIcon = screen.getByTestId('icon-mail')
      expect(mailIcon.classList.contains("active-icon")).toBeTruthy();
    })
  })

  test("when i click on the button nouvelle note de frais the modal appearse with th fields", () => {
    document.body.innerHTML = NewBillUI()
    expect(screen.getByTestId("form-new-bill")).toBeTruthy()// le formilaire
    expect(screen.getByTestId("expense-type")).toBeTruthy()
    expect(screen.getByTestId("expense-name")).toBeTruthy()
    expect(screen.getByTestId("datepicker")).toBeTruthy()
    expect(screen.getByTestId("amount")).toBeTruthy()
    expect(screen.getByTestId("vat")).toBeTruthy()
    expect(screen.getByTestId("pct")).toBeTruthy()
    expect(screen.getByTestId("commentary")).toBeTruthy()
    expect(screen.getByTestId("file")).toBeTruthy()
    expect(screen.getByRole("button")).toBeTruthy()
  })
  /* test('when i click on the eye icon a modal should show up',()=>{
     expect(screen.getByTestId("modaleFileEmployee"))
   })*/
})
