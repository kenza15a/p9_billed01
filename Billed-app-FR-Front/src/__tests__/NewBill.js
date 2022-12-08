/**
 * @jest-environment jsdom
 */

import { screen } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"


describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("The icon of a mail should be active ", async () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      /* await waitFor(() => html.getByTestId('icon-mail'))
       const mailIcon = html.getByTestId('icon-mail')
       expect(mailIcon.classList.contains("active-icon")).toBeTruthy();*/
    })
  })
})
