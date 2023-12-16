import { Presenter } from '../../application/presenter/Presenter';

export class CSVPresenter implements Presenter {
  present(data: any) {
    const lines: string[] = [];
    const [firstElement] = data;
    const header = [];
    for (const key in firstElement) {
      if (Object.prototype.hasOwnProperty.call(firstElement, key)) {
        header.push(key);
      }
    }
    lines.push(header.join(','));
    for (const element of data) {
      const line = [];
      for (const key in element) {
        if (Object.prototype.hasOwnProperty.call(element, key)) {
          line.push(element[key]);
        }
      }
      lines.push(line.join(','));
    }

    return lines;
  }
}
