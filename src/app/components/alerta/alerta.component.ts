import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-alerta',
  templateUrl: './alerta.component.html',
  styleUrls: ['./alerta.component.css']
})
export class AlertaComponent implements OnInit {

  @Input() mensaje: any;
  @Input() mensaje_exito: any;
  @Input() mensaje_error: any;

  constructor() { }

  ngOnInit(): void {
  }

}
