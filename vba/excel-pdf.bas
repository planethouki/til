Sub pdf()
	Const pathFrom = "<path\>"
	Const pathTo = "<path\>"
	buf = Dir(pathFrom & Åg*.xlsxÅh)
	Do While buf <> ""
		Dim book As Workbook
		Set book = Workbooks.Open(pathFrom & buf)
		'ExportAsFixedFormat(Type As XlFixedFormatType, [Filename], [Quality], [IncludeDocProperties], [IgnorePrintAreas], [From], [To], [OpenAfterPublish], [FixedFormatExtClassPtr], [WorkIdentity])
		book.ExportAsFixedFormat _
		Type:=xlTypePDF, _
		Filename:=pathTo & Replace(book.Name, Åg.xlsxÅh, ÅgÅh)
		book.Close SaveChanges:=False
		buf = Dir()
	Loop
End Sub