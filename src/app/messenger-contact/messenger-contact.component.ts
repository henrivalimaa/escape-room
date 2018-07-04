import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-messenger-contact',
  templateUrl: './messenger-contact.component.html',
  styleUrls: ['./messenger-contact.component.css']
})
export class MessengerContactComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<MessengerContactComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {}

  close(): void {
    this.dialogRef.close();
  }

}
