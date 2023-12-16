import { Presenter } from '../../application/presenter/Presenter';

export class HTMLPresenter implements Presenter {
  present(data: any) {
    let html = `<table border="1"><thread><tr>`;
    const [firstElement] = data;
    for (const key in firstElement) {
      if (Object.prototype.hasOwnProperty.call(firstElement, key)) {
        html += `<td>${key}</td>`;
      }
    }
    html += `</tr></thead><tbody>`;
    for (const element of data) {
      html += `<tr>`;
      for (const key in element) {
        if (Object.prototype.hasOwnProperty.call(element, key)) {
          html += `<td>${element[key]}</td>`;
        }
      }
      html += `</tr>`;
    }
    html += `</tbody></table>`;

    return html;
  }
}
