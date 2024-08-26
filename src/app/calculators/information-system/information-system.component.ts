import { Component } from '@angular/core';
import {arraysEqual, divisors, getGCD, isPrime, zeroDivisors} from "../../functions";
import {FormControl} from "@angular/forms";
import {row} from "mathjs";

@Component({
  selector: 'app-information-system',
  templateUrl: './information-system.component.html',
  styleUrl: './information-system.component.css'
})
export class InformationSystemComponent {
  displayedColumns: string[] = ['zeroDivisors', 'divisors'];
  dataSource: any = [];
  numberInput = new FormControl();
  primeNumberInput = new FormControl();
  modeFC: FormControl<any> = new FormControl(TableModes.divisors);
  modes = ['Divisors','Prime Divisors','Composite Divisors','Reduct']
  divisors:number[] = [];
  primeDivisors:number[] = [];
  selectedDivisorsFC = new FormControl([]);
  isPrime: boolean = false;
  selectDivsOrZeroDivs = true;

  constructor() {
    this.numberInput.valueChanges.subscribe(value => {
      this.primeNumberInput.reset()
      this.selectedDivisorsFC.reset()
      this.isPrime = isPrime(value);
      if (this.isPrime) return
      this.updateTable(value, this.modeFC.value);
    });
    this.modeFC.valueChanges.subscribe(v=> {
      this.updateTable(this.numberInput.value, v)
    })
    this.primeNumberInput.valueChanges.subscribe(v=> {
      this.updateTable(this.numberInput.value, TableModes.reduct)
    })
    this.selectedDivisorsFC.valueChanges.subscribe(v=> {
      this.updateTable(this.numberInput.value, this.modeFC.value, v!)
    })
  }

  informationSystem(zeroDivisor: number, divs: number[], number: number) {
    let gcd = getGCD(zeroDivisor, number);
    let result = [];
    for (let divisor of divs) {
      if (gcd % divisor !== 0) {
        result.push(0);
        continue;
      }
      let i = 1;
      while (i < number) {
        if (gcd % (divisor ** i) === 0 && gcd % (divisor ** (i + 1)) !== 0) {
          result.push(i);
          break;
        }
        i++;
      }
    }
    return result;
  }

  updateTable(number: string, mode: string, selectDivs?: number[], showZd: boolean = this.selectDivsOrZeroDivs): void {
    const num = parseInt(number);
    let divs: number[] = []
    if (!selectDivs) {
      divs = divisors(num);
      this.divisors = divs;
    }else {
      divs = selectDivs.length ? selectDivs : this.divisors
    }

    if (mode === TableModes.prime_divisors) {
      divs = divs.filter(e=> isPrime(e))
    }
    if (mode === TableModes.composite_divisors) {
      divs = divs.filter(e=> !isPrime(e))
    }
    if (mode === TableModes.reduct) {
      const originalDivs = structuredClone(divs);

      const primeDivisors = divs.filter(isPrime);

      this.primeDivisors = primeDivisors;

      const filteredDivisors = primeDivisors.filter(e => e !== this.primeNumberInput.value);

      divs = [
        ...filteredDivisors,
        ...filteredDivisors.map(e => e * this.primeNumberInput.value)
      ];

      const a = [];
      let value;
      for (let i = 2; (value = this.primeNumberInput.value ** i) < this.numberInput.value; i++) {
        if (originalDivs.includes(value)) {
          a.push(value);
        } else {
          break;
        }
      }

      divs = [...divs, ...a];
    }

    const divsToString = divs.map(e=> e.toString());
    let zeroDivs: number[];
    if (showZd){
      zeroDivs = zeroDivisors(num);
    }
    else {
      zeroDivs = this.divisors;
    }
    let rows = zeroDivs.map(zd => {
      const results = this.informationSystem(zd, divs, num);
      return { zeroDivisors: zd, results: results.reduce((acc, result, index) => ({ ...acc, [divs[index]]: result }), {}), duplicates: [] as any, isSelected: false};
    });

    let modifiedRows = rows.map(row => {
      if (!row.duplicates) {
        row.duplicates = [];
      }
      return row;
    });

    const indicesToRemove = new Set();

    for (let index = 0; index < modifiedRows.length; index++) {
      const row = modifiedRows[index];
      for (let index2 = index + 1; index2 < modifiedRows.length; index2++) {
        const row2 = modifiedRows[index2];
        if (arraysEqual(Object.values(row.results), Object.values(row2.results))) {
          row.duplicates.push(row2.zeroDivisors);
          indicesToRemove.add(index2);
        }
      }
    }

    modifiedRows = modifiedRows.filter((_, index) => !indicesToRemove.has(index));

    if (this.modeFC.value === TableModes.reduct && !this.primeNumberInput.value) return
    this.dataSource = modifiedRows.map(e=> {
      return {zeroDivisors: e.zeroDivisors, ...e.results, duplicates: e.duplicates}
    })


    this.displayedColumns = ['zeroDivisors', ...divsToString];
  }

  selectDivsZeroDivs(mode: boolean){
    this.selectDivsOrZeroDivs = mode;
    this.updateTable(this.numberInput.value, this.modeFC.value, this.selectedDivisorsFC.value!, mode )
  }

  toggleSelectionRow(row: any){
    row.isSelected = !row.isSelected;
  }

  protected readonly TableModes = TableModes;
}

enum TableModes {
  divisors = 'Divisors',
  prime_divisors = 'Prime Divisors',
  composite_divisors = 'Composite Divisors',
  reduct = 'Reduct'
}
